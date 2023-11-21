import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Logger } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiTags } from '@nestjs/swagger';
import { Cron } from '@nestjs/schedule';
import { MerchantService } from 'src/merchant/merchant.service';
import axios, { AxiosResponse } from 'axios'
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, lastValueFrom, map } from 'rxjs';

@Controller('transactions')
@ApiTags("transactions")
export class TransactionsController {
  private logger = new Logger(TransactionsController.name);

  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly merchantService: MerchantService,

  ) {

    this.processCallbacks()
  }

  @Get("/incoming")
  findAllIncoming(
    @Query('page', ParseIntPipe) page: number = 1, // default to page 1
    @Query('perPage', ParseIntPipe) perPage: number = 10, // default to 10 items per page
  ) {
    return this.transactionsService.findAllIncoming(page, perPage);
  }

  @Get('/incoming/:txnHash')
  findOneIncoming(@Param('txnHash') txnHash: string) {
    return this.transactionsService.findOneIncoming(txnHash);
  }

  @Get("/outgoing")
  findAllOutgoing(
    @Query('page', ParseIntPipe) page: number = 1, // default to page 1
    @Query('perPage', ParseIntPipe) perPage: number = 10, // default to 10 items per page
  ) {
    return this.transactionsService.findAllOutgoing(page, perPage);
  }

  @Get('/outgoing/:txnHash')
  findOneOutgoing(@Param('txnHash') txnHash: string) {
    return this.transactionsService.findOneOutgoing(txnHash);
  }

  @Get("/allTransactions")
  findAllTransaction() {
    return this.transactionsService.findAll();
  }

  @Get("/allTransactions")
  findAllOrphanTransactions() {
    return this.transactionsService.findAllOrphan();
  }

  @Get("/byUser/:userId")
  getTransactionsByUser(@Param('userId') userId: string) {
    return this.transactionsService.getAllTransactionByUser(userId)
  }

  @Get("/byWallet/:wallet")
  getTransactionsByWallet(@Param('wallet') wallet: string) {
    return this.transactionsService.getAllTransactionByWallet(wallet)
  }

  @Cron('*/5 * * * *')
  async processCallbacks() {
    const allTransactions = await this.transactionsService.getAllUnAckTransaction();
    for (const txn of allTransactions) {
      if (txn.user) {
        await this.sendCallback(txn);
      }
    }
  }

  @Get("/dashboardStats")
  getDashboardStats() {
    return this.transactionsService.getDashboardStats();
  }

  async sendCallback(txn) {
    const merchantCallBackUrl = await this.merchantService.getMerchantCallBackUrl(txn.user.merchantId);
  
    if (merchantCallBackUrl) {
      const payload = {
        txnHash: txn.txnHash,
        txnTime: txn.createdAt,
        username: txn.user.username,
        amount: txn.amount,
      };
  
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Callback request timed out')), 3000)
        );
  
        const fetchPromise = fetch(merchantCallBackUrl, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
  
        const response = await Promise.race([fetchPromise, timeoutPromise]);
  
        if (response instanceof Response) {
          if (response.status === 200 || response.status === 201) {
            await this.transactionsService.markTxnAsAck(txn.txnHash);
          }
        } else {
          this.logger.error('Invalid response type:', response);
        }
      } catch (err) {
        this.logger.error('Error sending callback:', err);
      }
    }
  }

}
