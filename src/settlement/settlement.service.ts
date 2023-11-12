import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SettlementService {
 
  constructor(private prisma: PrismaService,) {
  }

  findAll() {
    return this.prisma.settlements.findMany();
  }

  findOne(txnHash: string) {
    return this.prisma.settlements.findFirst({
      where: {
        txnHash
      }
    });
  }

}
