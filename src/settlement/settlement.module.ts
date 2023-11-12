import { Module } from '@nestjs/common';
import { SettlementService } from './settlement.service';
import { SettlementController } from './settlement.controller';

@Module({
  controllers: [SettlementController],
  providers: [SettlementService],
})
export class SettlementModule {}
