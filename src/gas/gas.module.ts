import { Module } from '@nestjs/common';
import { GasService } from './gas.service';
import { GasController } from './gas.controller';
import { TransactionsService } from 'src/transactions/transactions.service';
import { WalletService } from 'src/wallet/wallet.service';

@Module({
  controllers: [GasController],
  providers: [GasService, TransactionsService, WalletService,
  ],
})
export class GasModule {}
