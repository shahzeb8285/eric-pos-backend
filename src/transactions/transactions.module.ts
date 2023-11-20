import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from 'nestjs-prisma';
import { WalletService } from 'src/wallet/wallet.service';
import { MerchantService } from 'src/merchant/merchant.service';
import { PasswordService } from 'src/password.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[HttpModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService, WalletService,MerchantService,PasswordService],
})

export class TransactionsModule { }
