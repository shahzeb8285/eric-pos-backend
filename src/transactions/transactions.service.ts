import { Injectable } from '@nestjs/common';
import { CreateIncomingTransactionDto,CreateOutgoingTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'nestjs-prisma';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService,
  private walletService: WalletService) { }

  async createIncoming(createTransactionDto: CreateIncomingTransactionDto) {
    const userId = await this.walletService.getUserIdByWallet(createTransactionDto.walletId);
    return await this.prisma.incomingTransactions.create({
      data: {
        ...createTransactionDto,
        userId,
      }
    })
  }

  findAllIncoming() {
    return this.prisma.incomingTransactions.findMany({include: {
      user:true
    },})
  }

  findOneIncoming(txnHash: string) {
    return this.prisma.incomingTransactions.findFirst({
      include: {
        user:true
      },
      where: {
      txnHash
    }})
  }




  async createOutgoing(createTransactionDto: CreateOutgoingTransactionDto) {
    const userId = await this.walletService.getUserIdByWallet(createTransactionDto.walletId);
    return await this.prisma.outgoingTransactions.create({
      data: {
        ...createTransactionDto,
        userId,
      }
    })
  }

  findAllOutgoing() {
    return this.prisma.outgoingTransactions.findMany({
      include: {
        user:true
      },
    })
  }

  findOneOutgoing(txnHash: string) {
    return this.prisma.outgoingTransactions.findFirst({
      include: {
        user:true
      },
      where: {
      txnHash
    }})
  }

  // findAllOutgoing() {
  //   return this.prisma.outgoingTransactions.findMany({})
  // }

  async findAll() {
    const incomingTxns = await this.prisma.incomingTransactions.findMany()
    const outgoingTxns = await this.prisma.outgoingTransactions.findMany()

    return {
      incomingTxns,
      outgoingTxns
    }
  }

}
