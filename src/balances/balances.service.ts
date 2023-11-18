import { Injectable } from '@nestjs/common';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class BalancesService {
  constructor(private prisma: PrismaService,
  ) { }

  create(createBalanceDto: CreateBalanceDto) {
    return this.prisma.balances.create({
      data: createBalanceDto,
      include: {
        wallet: {
          select: {
            user: {
              select: {
                merchant: {
                  select: {
                    configs:true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  findOne(wallet: string, symbol: string) {
    return this.prisma.balances.findFirst({
      where: {
        walletAddress: wallet,
        currencySymbol: symbol
      },
      include: {
        wallet: {
          select: {
            user: {
              select: {
                merchant: {
                  select: {
                    configs:true
                  }
                }
              }
            }
          }
        }
      }
    })
  }

  // where: {
  //   AND: [
  //     {
  //       walletAddress: wallet
  //     },
  //     {
  //       currencySymbol: symbol
  //     }
  //   ]
  // }


  updateBalance(id: string, updatedBalance: string) {
    return this.prisma.balances.update({
      where: {
        id
      },
      data: {
        balance: updatedBalance
      },
      include: {
        wallet: {
          select: {
            user: {
              select: {
                merchant: {
                  select: {
                    configs:true
                  }
                }
              }
            }
          }
        }
      }
    })
  }
}
