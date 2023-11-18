import { Controller, Get, Param, Logger } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiTags } from '@nestjs/swagger';
import { OnEvent } from '@nestjs/event-emitter';
import { WalletBalanceExceedsEvent } from 'src/events/wallet.event';
import { Cron } from '@nestjs/schedule';

@Controller('wallet')
@ApiTags("wallet")
export class WalletController {
  private logger = new Logger(WalletController.name);
  constructor(private readonly walletService: WalletService,) { }

  //todo: Shahzeb, please check if this is correct, I've combined the two functions into one, and added await
  @OnEvent('wallet.balanceExceeds')
  async handleNewWalletAddEvent(payload: WalletBalanceExceedsEvent) {
    await this.walletService.markSettlement(payload.walletAddress, true)
  }

  // todo: Shahzeb, add auth guard and (if user is admin, return all wallets, if user is merchant, return only wallets that belong to merchant)
  @Get()
  findAll() {
    this.logger.debug("findAll is called by xxxx")
    return this.walletService.findAll();
  }

  @Cron('0 3 * * *')
  async handleCron() {
    this.logger.log('Cron job started, detaching wallets!')
    this.walletService.detachWallets()
  }

  // todo: Shahzeb, add auth guard and (if user is admin, return all wallets, if user is merchant, return only wallets that belong to merchant)
  @Get(":address")
  findOne(@Param('address') address: string) {
    this.logger.debug("findOne for address ${address} is called by xxxx")
    return this.walletService.findOne(address);
  }

  // todo: Shahzeb, add auth guard and (if user is admin, return all wallets, if user is merchant, return only wallets that belong to merchant)
  @Get("/balance/:address")
  getbalance(@Param('address') address: string) {
    this.logger.debug("getbalance for address ${address} is called by xxxx")
    return this.walletService.getBalancesByWallet(address)
  }
}
