import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SettlementService } from './settlement.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('settlement')
@ApiTags("settlement")
export class SettlementController {
  constructor(private readonly settlementService: SettlementService) {}


  @Get()
  findAll() {
    return this.settlementService.findAll();
  }

  @Get(':txnHash')
  findOne(@Param('txnHash') txnHash: string) {
    return this.settlementService.findOne(txnHash);
  }

  

  
}
