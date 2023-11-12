import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('transactions')
@ApiTags("transactions")

export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get("/incoming")
  findAllIncoming() {
    return this.transactionsService.findAllIncoming();
  }

  @Get('/incoming/:txnHash')
  findOneIncoming(@Param('txnHash') txnHash: string) {
    return this.transactionsService.findOneIncoming(txnHash);
  }


  @Get("/outgoing")
  findAllOutgoing() {
    return this.transactionsService.findAllOutgoing();
  }

  @Get('/outgoing/:txnHash')
  findOneOutgoing(@Param('txnHash') txnHash: string) {
    return this.transactionsService.findOneOutgoing(txnHash);
  }


 

  @Get("/allTransactions")
  findAllTransaction() {
    return this.transactionsService.findAll();
  }


 
 

}
