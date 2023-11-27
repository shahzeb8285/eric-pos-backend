import { Controller, Get, Param, Logger } from '@nestjs/common';
import { SettlementService } from './settlement.service';
import { ApiTags } from '@nestjs/swagger';
import { Cron } from '@nestjs/schedule';

@Controller('settlement')
@ApiTags("settlement")
export class SettlementController {
  private logger = new Logger(SettlementController.name);

  constructor(private readonly settlementService: SettlementService) {
    this.handleCron()
  }

  @Get()
  findAll() {
    return this.settlementService.findAll();
  }

  @Get(':txnHash')
  findOne(@Param('txnHash') txnHash: string) {
    return this.settlementService.findOne(txnHash);
  }

  // running every 5 minutes
  // is should be more than 2 mins because BSC has 2 sec block time
  @Cron('*/5 * * * *')
  async handleCron() {
    this.logger.debug('cron job for checking settlement started.');
    await this.settlementService.settleWallets()
  }
}
