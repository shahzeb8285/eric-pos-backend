import { Injectable, Logger } from '@nestjs/common';
import { CreateIncomingTransactionDto, CreateOutgoingTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'nestjs-prisma';
import { WalletService } from 'src/wallet/wallet.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OutgoingTransactionEvent } from 'src/events/outgoing.txn.create.event';
import { IncomingTransactionEvent } from 'src/events/incoming.txn.create.event';

@Injectable()
export class TransactionsService {
  private logger = new Logger(TransactionsService.name);

  constructor(private prisma: PrismaService, private walletService: WalletService, private eventEmitter: EventEmitter2) { }

  async createIncoming(createTransactionDto: CreateIncomingTransactionDto) {
    this.logger.log({ level: "info", message: `Creating incoming transaction ${createTransactionDto.txnHash} for wallet ${createTransactionDto.walletId}` });
    const userId = await this.walletService.getUserIdByWallet(createTransactionDto.walletId);

    const txn = await this.prisma.incomingTransactions.create({
      data: {
        ...createTransactionDto,
        userId,
        isOrphanTxn: userId ? false : true
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
    this.logger.log({ level: "info", message: `Creating outgoing transaction ${createTransactionDto.txnHash} for wallet ${createTransactionDto.walletId}` });
    const userId = await this.walletService.getUserIdByWallet(createTransactionDto.walletId);
    const txn = await this.prisma.outgoingTransactions.create({
      data: {
        ...createTransactionDto,
        userId,
      }
    })

    const event = new OutgoingTransactionEvent()
    event.data = txn;
    event.walletAddress = createTransactionDto.walletId
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

  async findAll() {
    const incomingTxns = await this.prisma.incomingTransactions.findMany()
    const outgoingTxns = await this.prisma.outgoingTransactions.findMany()

    return {
      incomingTxns,
      outgoingTxns
    }
  }

  async getDashboardStats() {
    const incomingTxns = await this.prisma.incomingTransactions.findMany()
    const outgoingTxns = await this.prisma.outgoingTransactions.findMany()
    
    const summarizedData = [];

    const allTransactions = [...incomingTxns, ...outgoingTxns];
    
    // Group transactions by date
    const transactionsByDate = allTransactions.reduce((acc, transaction) => {
      const date = transaction.createdAt.toISOString().split('T')[0];

      if (!acc[date]) {
        acc[date] = {
          date,
          noOfInTxn: 0,
          noOfOutTxn: 0,
          inAmount: BigInt(0),
          outAmount: BigInt(0),
          inCommission: BigInt(0),
          outCommission: BigInt(0),
          inGasFee: BigInt(0),
          outGasFee: BigInt(0)
        };
      }

      if ('fromAddress' in transaction) {
        // Incoming transaction
        acc[date].noOfInTxn += 1;
        acc[date].inAmount += BigInt(transaction.amount);
        acc[date].inCommission += this.calculateCommission(transaction.amount);
        // acc[date].inGasFee (no gas fee for incoming txn)
      } else {
        // Outgoing transaction
        acc[date].noOfOutTxn += 1;
        acc[date].outAmount += BigInt(transaction.amount);
        // acc[date].outCommission (no commission for outgoing txn)
        acc[date].outGasFee += BigInt(transaction.gasFee);
      }

      return acc;
    }, {});

    // Convert all BigInt to strings becuz BigInt cannot be serialized
    Object.keys(transactionsByDate).forEach(date => {
      transactionsByDate[date].inAmount = transactionsByDate[date].inAmount.toString();
      transactionsByDate[date].inCommission = transactionsByDate[date].inCommission.toString();
      transactionsByDate[date].outAmount = transactionsByDate[date].outAmount.toString();
      transactionsByDate[date].outCommission = transactionsByDate[date].outCommission.toString();
      transactionsByDate[date].inGasFee = transactionsByDate[date].inGasFee.toString();
      transactionsByDate[date].outGasFee = transactionsByDate[date].outGasFee.toString();
    });

    Object.values(transactionsByDate).forEach((summary) => {
      summarizedData.push(summary);
    });

    return summarizedData;
  }

  calculateCommission = (amount: string): bigint => {
    const commissionRate = 0.015;
    const amountBigInt = BigInt(amount);
    const commission = amountBigInt * BigInt(Math.floor(commissionRate * 10000)) / BigInt(10000);
    return commission;
  };
}
