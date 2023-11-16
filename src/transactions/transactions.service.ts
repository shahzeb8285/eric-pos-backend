import { Injectable } from '@nestjs/common';
import { CreateIncomingTransactionDto, CreateOutgoingTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'nestjs-prisma';
import { WalletService } from 'src/wallet/wallet.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OutgoingTransactionEvent } from 'src/events/outgoing.txn.create.event';
import { IncomingTransactionEvent } from 'src/events/incoming.txn.create.event';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService,
    private walletService: WalletService,
    private eventEmitter: EventEmitter2
  ) { }

  async createIncoming(createTransactionDto: CreateIncomingTransactionDto) {
    const userId = await this.walletService.getUserIdByWallet(createTransactionDto.walletId);

    const txn = await this.prisma.incomingTransactions.create({
      data: {
        ...createTransactionDto,
        userId,
        isOrphanTxn:userId?false:true
      }
    });

    const event = new IncomingTransactionEvent()
    event.data = txn;
    event.walletAddress = createTransactionDto.walletId
    this.eventEmitter.emit(
      'incomingtxn.created',
      event
    );

    return txn
  }

  findAllIncoming() {
    return this.prisma.incomingTransactions.findMany({
      include: {
        user: true
      },
    })
  }

  findOneIncoming(txnHash: string) {
    return this.prisma.incomingTransactions.findFirst({
      include: {
        user: true
      },
      where: {
        txnHash
      }
    })
  }




  async createOutgoing(createTransactionDto: CreateOutgoingTransactionDto) {
    const userId = await this.walletService.getUserIdByWallet(createTransactionDto.walletId);
    const txn = await this.prisma.outgoingTransactions.create({
      data: {
        ...createTransactionDto,
        userId,
      }
    })
    const event = new OutgoingTransactionEvent()
    event.data = txn;
    this.eventEmitter.emit(
      'outgoingtxn.created',
      event
    );

    return txn;
  }

  findAllOutgoing() {
    return this.prisma.outgoingTransactions.findMany({
      include: {
        user: true
      },
    })
  }

  findOneOutgoing(txnHash: string) {
    return this.prisma.outgoingTransactions.findFirst({
      include: {
        user: true
      },
      where: {
        txnHash
      }
    })
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
