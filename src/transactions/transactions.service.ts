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

  constructor(private prisma: PrismaService, private walletService: WalletService, private eventEmitter: EventEmitter2) { 
  }

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

    const preBalanceFromDB = await this.prisma.wallet.findUnique({
      where: {
        address:createTransactionDto.walletId
      },
      select: {
        idrtBalance:true
      }
    })

    let idrtBalance = 0;
    if (preBalanceFromDB && preBalanceFromDB.idrtBalance) {
        idrtBalance = Number(preBalanceFromDB.idrtBalance)
    }
    idrtBalance += Number(createTransactionDto.amount);
    await this.prisma.wallet.update({
      data: {
        idrtBalance: idrtBalance.toString()
      },
      where: {
        address:createTransactionDto.walletId
      }
    })

 
    return txn
  }

  findAllIncoming() {
    return this.prisma.incomingTransactions.findMany({
      include: {
        user: true
      },
    })
  }

  updateGasFee(txnHash: string, gasFee: string) {
    return this.prisma.outgoingTransactions.update({
      where: {
        txnHash,
      },
      data: {
        gasFee
      }
    })
  }


  async getAllTransactionByUser(userId: string) {
    const incomingTxns = await this.prisma.incomingTransactions.findMany({
      where: {
        userId,
      }
    })
    const outgoingTxns = await this.prisma.outgoingTransactions.findMany(
      {
        where: {
          userId,
        }
      }
    )

    return {
      incomingTxns,
      outgoingTxns
    }
  }

  async getAllTransactionByWallet(walletId: string) {
    const incomingTxns = await this.prisma.incomingTransactions.findMany({
      where: {
        walletId,
      }
    })
    const outgoingTxns = await this.prisma.outgoingTransactions.findMany(
      {
        where: {
          walletId,
        }
      }
    )

    return {
      incomingTxns,
      outgoingTxns
    }
  }
  findTxnsWithoutGasFee() {
    return this.prisma.outgoingTransactions.findMany({
      where: {
        gasFee: undefined
      }
    })
  }

  findOneIncoming(txnHash: string) {
    return this.prisma.incomingTransactions.findUnique({
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

    // const event = new OutgoingTransactionEvent()
    // event.data = txn;
    // event.walletAddress = createTransactionDto.walletId
    // this.eventEmitter.emit(
    //   'outgoingtxn.created',
    //   event
    // );

    let idrtBalance = 0;
    const preBalanceFromDB = await this.prisma.wallet.findUnique({
      where: {
        address:createTransactionDto.walletId
      },
      select: {
        idrtBalance:true
      }
    })
    if (preBalanceFromDB && preBalanceFromDB.idrtBalance) {
        idrtBalance = Number(preBalanceFromDB.idrtBalance)
    }
    idrtBalance += Number(createTransactionDto.amount);
    await this.prisma.wallet.update({
      data: {
        idrtBalance: idrtBalance.toString()
      },
      where: {
        address:createTransactionDto.walletId
      }
    })

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
    return this.prisma.outgoingTransactions.findUnique({
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

  async findAllOrphan() {
    const incomingTxns = await this.prisma.incomingTransactions.findMany({
      where: {
        isOrphanTxn: true
      }
    })


    return incomingTxns
  }


  getAllUnAckTransaction() {
    return this.prisma.incomingTransactions.findMany({
      where: {
        callbackStatus: "UNACK",
        isOrphanTxn:false,
      },
      include: {
        user: true,

      }
    })

  }

  markTxnAsAck(txnHash: string) {
    return this.prisma.incomingTransactions.update({
      where: {
        txnHash,
      },
      data: {
        callbackStatus: "ACK"
      }
    })

  }

}
