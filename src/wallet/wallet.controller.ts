import { Controller, Get, Param} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiTags } from '@nestjs/swagger';
import { OnEvent } from '@nestjs/event-emitter';
import { WalletBalanceExceedsEvent } from 'src/events/wallet.event';
import { Cron } from '@nestjs/schedule';
import { Logger } from 'winston';

@Controller('wallet')
@ApiTags("wallet")
export class WalletController {
  constructor(private readonly walletService: WalletService,
  ) { }


  @OnEvent('wallet.balanceExceeds')
  async handleNewWalletAddEvent(payload: WalletBalanceExceedsEvent) {
    this.markWalletAsReadyForSettlement(payload.walletAddress)
  }
  async markWalletAsReadyForSettlement(walletAddress: string) {
    this.walletService.markSettlement(walletAddress, true)
  }

  @Get()
  findAll() {
    return this.walletService.findAll();
  }

  @Cron('0 3 * * *')
  async handleCron() {
     this.walletService.detachWallets()
  }


  @Get(":address")
  findOne(@Param('address') address: string) {
    return this.walletService.findOne(address);
  }

  

  @Get("/balance/:address")
  getbalance(@Param('address') address: string) {
    return this.walletService.getBalancesByWallet(address)
  }


 



}
