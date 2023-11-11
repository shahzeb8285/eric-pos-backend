import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet as WalletEthers, HDNodeWallet, ethers, getDefaultProvider } from 'ethers';
import { PrismaService } from 'nestjs-prisma';
import { SETTINGS, getRPC } from 'src/settings';
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from 'ethereum-multicall';

import IERC20ABI from "../abis/IERC20.json"

@Injectable()
export class WalletService {
  private ethersProvider;
  private rpc;
  constructor(private prisma: PrismaService,
  ) {

    const rpc = getRPC()
    this.rpc = rpc
    this.ethersProvider = getDefaultProvider(rpc)
  }


  async getBalancesByWallet(wallet_address: string) {

    const multicall = new Multicall({
      tryAggregate: true,
      nodeUrl: this.rpc,
    });



    
    const callContexts: ContractCallContext[] = [];
    
    for (const asset of SETTINGS.ACCEPTED_TOKENS) {
      if (asset.address !== "0x0000000000000000000000000000000000000000") {
        callContexts.push(
          {
            reference: asset.address,
            abi: [{
              "constant": true,
              "inputs": [
                {
                  "name": "_owner",
                  "type": "address"
                }
              ],
              "name": "balanceOf",
              "outputs": [
                {
                  "name": "balance",
                  "type": "uint256"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
            },],
            contractAddress: asset.address,
            calls: [{ reference: 'balanceOf', methodName: 'balanceOf', methodParameters: [wallet_address] }]
          }
        )
      }
    }


    const balances = [];
    const nativeBalance = await this.ethersProvider.getBalance(wallet_address);

    const results: ContractCallResults = await multicall.call(callContexts);

    for (const asset of SETTINGS.ACCEPTED_TOKENS) {
      if (asset.address === "0x0000000000000000000000000000000000000000") {
        balances.push({
          ...asset,
          balance:nativeBalance.toString()
        })
      } else {
        const balance = Number(results.results[asset.address].callsReturnContext[0].returnValues[0].hex).toString()
        balances.push({
          ...asset,

          //@ts-ignore
          balance:balance
        })
      }
    }
    return balances
  }

  async generateWallet() {
    const mnemonics = process.env.MASTER_MNEMONIC
    const totalWalletCounts = await this.prisma.wallet.count()
    const path = `m/44'/60'/1'/0/${totalWalletCounts}`;

    const wallet = HDNodeWallet.fromPhrase(mnemonics, "", path);

    const address = wallet.address
    const privateKey = wallet.privateKey
    return { address, privateKey }
  }


  async assignWallet(createWalletDto: CreateWalletDto) {

    let nonAssignedWallet = await this.prisma.wallet.findFirst({
      where: {
        user: null
      }
    })

    if (!nonAssignedWallet) {
      const { address, privateKey } = await this.generateWallet()
      nonAssignedWallet = await this.prisma.wallet.create({
        data: {
          address: address,
          privatekey: privateKey,

        }
      })
    }

    const finalWallet = await this.prisma.wallet.update({
      where: {
        id: nonAssignedWallet.id
      },
      data: {
        user: {
          connect: {
            id: createWalletDto.userId
          }
        }
      }
    })
    return { address: finalWallet.address };
  }



  findAll() {
    return `This action returns all wallet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
