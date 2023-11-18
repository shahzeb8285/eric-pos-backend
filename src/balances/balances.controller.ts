import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { ApiTags } from '@nestjs/swagger';
import { OnEvent } from '@nestjs/event-emitter';
import { IncomingTransactionEvent } from 'src/events/incoming.txn.create.event';
import { OutgoingTransactionEvent } from 'src/events/outgoing.txn.create.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WalletBalanceExceedsEvent, WalletCreatedEvent } from 'src/events/wallet.event';

@Controller('balances')
@ApiTags("Balances")
export class BalancesController {
  private logger = new Logger(BalancesController.name);
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly balancesService: BalancesService) { }

  @OnEvent('incomingtxn.created')
  async handleNewIncomingTxnEvent(payload: IncomingTransactionEvent) {
    this.logger.log({ level: "info", message: `Handling incoming transaction event for address: ${payload.walletAddress}` });
    const balance = await this.balancesService.findOne(payload.walletAddress, payload.data.currencySymbol);
    let finalBalance;
    let balanceObj;

    if (balance) {
      finalBalance = BigInt(balance.balance) + BigInt(payload.data.amount);
      balanceObj = await this.balancesService.updateBalance(balance.id, finalBalance.toString())
    } else {
      balanceObj = await this.balancesService.create({
        walletAddress: payload.walletAddress,
        currencySymbol: payload.data.currencySymbol,
        balance: payload.data.amount,
      })
    }

    try {
      if (balanceObj.wallet.user.merchant.configs) {
        const maxIDRTLimitConfig = [...balanceObj.wallet.user.merchant.configs].find((item) => {
          return item.key === "maxIDRT"
        })

        const maxIDRTLimit = BigInt(maxIDRTLimitConfig.value);
        const currentBal = BigInt(balanceObj.balance)
        if (currentBal > maxIDRTLimit) {
          this.logger.log({ level: "info", message: `Balance exceeds maxIDRT limit for address: ${payload.walletAddress}` });
          const event = new WalletBalanceExceedsEvent()
          event.walletAddress = payload.walletAddress
          this.eventEmitter.emit(
            'wallet.balanceExceeds',
            event
          );
        }
      }
    } catch (err) {
      console.error("ERROR", err)
    }
  }

  @OnEvent('outgoingtxn.created')
  async handleNewOutGoingTxnEvent(payload: OutgoingTransactionEvent) {
    this.logger.log({ level: "info", message: `Handling outgoing transaction event for address: ${payload.walletAddress}, amount: ${payload.data.amount}` });
    const balance = await this.balancesService.findOne(payload.walletAddress, payload.data.currencySymbol);
    if (balance) {
      const finalBalance = BigInt(balance.balance) - BigInt(payload.data.amount);
      await this.balancesService.updateBalance(balance.id, finalBalance.toString())
    }
  }
}
