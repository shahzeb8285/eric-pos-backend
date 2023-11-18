import { Controller, Get, Post, Body, Patch, Param, Delete, Redirect, Query, Logger } from '@nestjs/common';
import { SettlementService } from './settlement.service';
import { ApiTags } from '@nestjs/swagger';
import { Cron } from '@nestjs/schedule';
import { WalletService } from 'src/wallet/wallet.service';
import { Prisma } from '@prisma/client';
import { HDNodeWallet, ethers } from 'ethers';
import IERC20 from 'src/abis/IERC20';
import { SETTINGS, getRPC } from 'src/settings';

@Controller('settlement')
@ApiTags("settlement")
export class SettlementController {
  private logger = new Logger(SettlementController.name);

  constructor(private readonly settlementService: SettlementService,
    private readonly walletService: WalletService) {

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
