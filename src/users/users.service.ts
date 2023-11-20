import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'nestjs-prisma';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService,
    private walletService: WalletService
  ) { }

  async create(createUserDto: CreateUserDto, merchantId: string) {
    let user = await this.prisma.user.findUnique({
      where: {
        username: createUserDto.username
      },
      include: {
        wallet: true,
        incomingTransactions: true,
        outgoingTransactions: true
      }
    })

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          username: createUserDto.username,
          merchant: {
            connect: { id: merchantId }
          }
        }, include: {
          wallet: true,
          incomingTransactions: true,
          outgoingTransactions: true
        }
      })
    }

    if (!user.walletId) {
      await this.walletService.assignWallet({ userId: user.id })
    }
    
    return this.findOne(createUserDto.username)
  }

  async findOne(username: string) {
    const resp = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        wallet: true,
        merchant: true,
        incomingTransactions: true,
        outgoingTransactions: true
      }
    })

    delete resp.merchant.password
    return resp
  }

  async getAddressInfo(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        wallet: true,
        incomingTransactions: true,
        outgoingTransactions: true
      }
    })

    return user
  }
}
