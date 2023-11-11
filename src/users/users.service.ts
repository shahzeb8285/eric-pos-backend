import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService,
    private walletService: WalletService
  ) { }

  async create(createUserDto: CreateUserDto) {
    let user = await this.prisma.user.findFirst({
      where: {
        username: createUserDto.username
      },
      include: {
        wallet: true
      }
    })

    let walletAddress;
    if (user) {
      walletAddress = user.wallet.address
    }


    if (!user) {

      user = await this.prisma.user.create({
        data: {
          username: createUserDto.username,
          role: "USER",
        }, include: {
          wallet: true
        }
      })
      const wallet = await this.walletService.assignWallet({ userId: user.id })
      walletAddress = wallet.address

    }



    return {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      username: user.username,
      wallet_address: walletAddress
    }


  }

  findAll() {
    return `This action returns all users`;
  }

 

  async getAddressInfo(username: string) {

    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
      include: {
        wallet: true
      }

    })

    let balances;
    if (user.wallet.address) {
     balances = await this.walletService.getBalancesByWallet(user.wallet.address);

    }

    return {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      username: user.username,
      balances,
      wallet_address: user.wallet.address
    }
  }


  
}
