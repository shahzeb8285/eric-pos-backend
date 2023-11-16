import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { ApiTags } from '@nestjs/swagger';
import { OnEvent } from '@nestjs/event-emitter';
import { IncomingTransactionEvent } from 'src/events/incoming.txn.create.event';
import { OutgoingTransactionEvent } from 'src/events/outgoing.txn.create.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WalletBalanceExceedsEvent, WalletCreatedEvent } from 'src/events/wallet.event';

@Controller('balances')
@ApiTags("Balances")
export class BalancesController {
  constructor(
    private eventEmitter: EventEmitter2,

    private readonly balancesService: BalancesService) { }

  @OnEvent('incomingtxn.created')
  async handleNewIncomingTxnEvent(payload: IncomingTransactionEvent) {

    const balance = await this.balancesService.findOne(payload.walletAddress, payload.data.currencySymbol);
    let finalBalance;
    let balanceObj;

    if (balance) {
      finalBalance = BigInt(balance.balance) + BigInt(payload.data.amount);
      balanceObj = await this.balancesService.updateBalance(balance.id,finalBalance.toString() )
    } else {
      balanceObj = await this.balancesService.create({
        walletAddress: payload.walletAddress,
        currencySymbol: payload.data.currencySymbol,
        balance:payload.data.amount,
      })
      // finalBalance = balance.balance

    }

    try {
      if (balanceObj.wallet.user.merchant.configs) {
        const maxIDRTLimitConfig = [...balanceObj.wallet.user.merchant.configs].find((item) => {
          return item.key ==="maxIDRT"
        })
        
        const maxIDRTLimit = BigInt(maxIDRTLimitConfig.value);
        const currentBal = BigInt(balanceObj.balance)
        if (currentBal > maxIDRTLimit) {
          const event = new WalletBalanceExceedsEvent()
          event.walletAddress = payload.walletAddress
          this.eventEmitter.emit(
            'wallet.balanceExceeds',
            event
          );

        } 
      }
      
    } catch (err) {
      console.error("ERROR",err)
    }
    
  }


  @OnEvent('outgoingtxn.created')
  async handleNewOutGoingTxnEvent(payload: OutgoingTransactionEvent) {
    const balance = await this.balancesService.findOne(payload.walletAddress, payload.data.currencySymbol);
    if (balance) {
      const finalBalance = BigInt(balance.balance) - BigInt(payload.data.amount);
      await this.balancesService.updateBalance(balance.id,finalBalance.toString() )
    } 
  }




}
