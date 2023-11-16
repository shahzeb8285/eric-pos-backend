import { Module } from '@nestjs/common';
import { SettlementService } from './settlement.service';
import { SettlementController } from './settlement.controller';
import { WalletService } from 'src/wallet/wallet.service';

@Module({
  controllers: [SettlementController],
  providers: [SettlementService,WalletService],
})
export class SettlementModule {}
