import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from 'nestjs-prisma';
import { WalletService } from 'src/wallet/wallet.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService, WalletService],
})

export class TransactionsModule { }
