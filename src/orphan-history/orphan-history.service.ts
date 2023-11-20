import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrphanHistoryDto } from './dto/create-orphan-history.dto';
import { UpdateOrphanHistoryDto } from './dto/update-orphan-history.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class OrphanHistoryService {
  constructor(private prisma: PrismaService, ) {
  }

  async getTxnByHash(hash: string) {
    const txn = await this.prisma.incomingTransactions.findUnique({
      where: {
       txnHash:hash
      },
      include: {
        user:true
      }
    })
 
    
    if (!txn) {
      throw new BadRequestException("Txn not found");
    }
    return  txn
  }

 async create(data: CreateOrphanHistoryDto) {
   


   await this.prisma.incomingTransactions.update({
     data: {
       isOrphanTxn: false,
       userId:data.userId
     },
     where: {
       txnHash:data.txnHash
     }
   })

   const history = await this.prisma.orphanHistory.create({
     data
   })

   return history


  }

  findAll() {
    return this.prisma.orphanHistory.findMany()
  }

 

}
