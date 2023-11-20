import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { AbstractProvider, HDNodeWallet, getDefaultProvider } from 'ethers';
import { PrismaService } from 'nestjs-prisma';
import { SETTINGS, getRPC } from 'src/settings';
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from 'ethereum-multicall';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { WalletCreatedEvent } from 'src/events/wallet.event';
import IERC20 from 'src/abis/IERC20';
import * as moment from 'moment';

@Injectable()
export class WalletService {
  private ethersProvider: AbstractProvider;
  private rpc: string;

  constructor(private prisma: PrismaService, private eventEmitter: EventEmitter2) {
    const rpc = getRPC()
    this.rpc = rpc
    this.ethersProvider = getDefaultProvider(rpc)
  }

  async markSettlement(address: string, isReadyForSettlement: boolean) {
    const resp = await this.prisma.wallet.update({
      data: {
        isReadyForSettlement,
      },
      where: {
        address
      }
    })
  }

  async updateBNBBalance(walletAddress: string, bnbBalance: string) {
    await this.prisma.wallet.update({
      data: {
        bnbBalance,
      },
      where: {
        address:walletAddress
      }
    })
  }

  async getWalletAssignmentByWallet(walletId: string) {
    const resp = await this.prisma.walletAssignment.findMany({
      where: {
        walletId,
      }
    })
    return resp
  }


  async getWalletAssignmentByUser(userId: string) {
    const resp = await this.prisma.walletAssignment.findMany({
      where: {
        userId,
      }
    })
    return resp
  }

  async detachWallets() {
    
    const targetDate = moment().subtract(SETTINGS.WALLET_DETACH_TIME);

    const allAssignedWallet = await this.prisma.wallet.findMany({
      where: {
        lastAssignedAt: {
          lte: targetDate.toDate()
        },
        isReadyForSettlement: false
      },
      include: {
        user: {
          select: {
            id:true
          }
        }
      }
    })

    allAssignedWallet.map(async (item) => {
      const assignmentHistory = await this.prisma.walletAssignment.findFirst({
        where: {
          walletId: item.address,
          userId: item.user.id,
          detachedAt:undefined
        }
      });

      await this.prisma.walletAssignment.update({
        where: {
         id:assignmentHistory.id
        },
        data: {
          detachedAt:new Date(),
        }
      })
      await this.prisma.wallet.update({
        where: {
          address: item.address,
        },
        data: {
          lastAssignedAt: null,
          user: null,
        }
      })
    })
  }

  async getUserIdByWallet(address: string) {
    const resp = await this.prisma.wallet.findUnique({
      where: {
        address
      },
      include: {
        user: true
      }
    })
    if (resp && resp.user) {
      return resp.user.id
    }
  }

  async getAllWalletAddresses() {
    const resp = await this.prisma.wallet.findMany({
      select: {
        address: true
      }
    })
    return resp.map((item) => {
      return item.address
    })
  }

  async getBalancesByWallet(wallet_address: string) {
    const multicall = new Multicall({
      tryAggregate: true,
      nodeUrl: this.rpc,
    });

    const callContexts: ContractCallContext[] = [];

    for (const asset of SETTINGS.ACCEPTED_TOKENS) {
      callContexts.push(
        {
          reference: asset.address,
          abi: IERC20,  //todo: Shahzeb need to update abi for new tokens?
          contractAddress: asset.address,
          calls: [{ reference: 'balanceOf', methodName: 'balanceOf', methodParameters: [wallet_address] }]
        }
      )
    }

    const balances = [];
    const nativeBalance = await this.ethersProvider.getBalance(wallet_address);

    const results: ContractCallResults = await multicall.call(callContexts);

    for (const asset of SETTINGS.ACCEPTED_TOKENS) {
      const balance = BigInt(results.results[asset.address].callsReturnContext[0].returnValues[0].hex).toString()
      balances.push({
        ...asset,
        //@ts-ignore
        balance: balance
      })
    }

    balances.push({
      ...SETTINGS.NATIVE,
      balance: nativeBalance.toString()
    })

    return balances
  }

  async generateWallet() {
    const mnemonics = process.env.MASTER_MNEMONIC
    const pathId = await this.prisma.wallet.count()
    const path = `${SETTINGS.WALLET_PATH}${pathId}`;

    const wallet = HDNodeWallet.fromPhrase(mnemonics, "", path);

    const address = wallet.address
    const event = new WalletCreatedEvent()
    event.walletAddress = address;
    this.eventEmitter.emit(
      'wallet.created',
      event
    );

    return { address, pathId }
  }

  async getNonAssignedWallet() {
    const wallet = await this.prisma.wallet.findFirst({
      orderBy: {
        idrtBalance:"asc",
      },
      where: {
        user: null
      }
    })
  

    return wallet
  }
  async assignWallet(createWalletDto: CreateWalletDto) {
    let nonAssignedWallet = await this.getNonAssignedWallet();


    if (nonAssignedWallet != null) {
      const { address, pathId } = await this.generateWallet()
      nonAssignedWallet = await this.prisma.wallet.create({
        data: {
          address: address,
          lastAssignedAt: new Date(),
          pathId
        }
      })
    }

    const finalWallet = await this.prisma.wallet.update({
      where: {
        address: nonAssignedWallet.address
      },
      data: {
        user: {
          connect: {
            id: createWalletDto.userId
          }
        }
      }
    })

    await this.prisma.walletAssignment.create({
      data: {
        userId: createWalletDto.userId,
        walletId: finalWallet.address,
        
    }})
    return { address: finalWallet.address };
  }

  findAll() {
    return this.prisma.wallet.findMany({
     
    })
  }


  findAllByMerchant(merchantId:string) {
    return this.prisma.wallet.findMany({
      where: {
        user: {
          merchantId,
        }
      },
     
    })
  }

  findAllUnsettledWallets() {
    return this.prisma.wallet.findMany({
      where: {
        isReadyForSettlement: true,
      },
      include: {
        user: {
          select: {
            merchant: {
              select: {
                configs: true
              }
            }
          }
        }
      }
    })
  }

  findOne(address: string) {
    return this.prisma.wallet.findUnique({
      where: {
        address: address,
      },
      include: {
        user:true
      }
    })
  }
}
