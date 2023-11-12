import { Module } from '@nestjs/common';
import { WatcherService } from './watcher.service';
import { WatcherController } from './watcher.controller';
import { WalletService } from 'src/wallet/wallet.service';
import { TransactionsService } from 'src/transactions/transactions.service';

@Module({
  controllers: [WatcherController],
  providers: [WatcherService,WalletService,TransactionsService],
})
export class WatcherModule {}
