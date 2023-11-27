import { Controller, Get, Param, Logger, UseGuards, Request, UnauthorizedException, NotFoundException, Query, BadRequestException } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OnEvent } from '@nestjs/event-emitter';
import { WalletBalanceExceedsEvent } from 'src/events/wallet.event';
import { Cron } from '@nestjs/schedule';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('wallet')
@ApiBearerAuth()
@ApiTags("wallet")
export class WalletController {
  private logger = new Logger(WalletController.name);
  constructor(private readonly walletService: WalletService,) {

    this.walletService.getNonAssignedWallet()
  }

  @OnEvent('wallet.balanceExceeds')
  async handleNewWalletAddEvent(payload: WalletBalanceExceedsEvent) {
    await this.walletService.markSettlement(payload.walletAddress, true)
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req) {
    if (req.user.isAdmin) {
      return this.walletService.findAll();
    }

    this.logger.debug("findAll is called by xxxx")
    return this.walletService.findAllByMerchant(req.user.id);
  }

  @Cron('0 3 * * *')
  async handleCron() {
    this.logger.log('Cron job started, detaching wallets!')
    this.walletService.detachWallets()
  }

  @Get(":address")
  @UseGuards(AuthGuard)
  async findOne(@Request() req, @Param('address') address: string) {
    this.logger.debug(`findOne for address ${address} is called by `)

    const wallet = await this.walletService.findOne(address);
    if (wallet) {
      if (!req.user.isAdmin) {
        if (wallet.user && wallet.user.merchantId === req.user.id) {
          return wallet
        } else {
          throw new UnauthorizedException()
        }
      }
      return wallet
    } else {
      throw new NotFoundException()
    }
  }

  @Get("/assignHistory")
  @UseGuards(AuthGuard)
  async getAssignHistory(@Request() req,
    @Query() query: { userId: string, walletAddress: string },
  ) {

    if (!query.userId && !query.walletAddress) {
      throw new BadRequestException("include userId or walletAddress as params")
    }

    // if (!req.user.isAdmin) {
    //   throw new UnauthorizedException() 
    // }

    if (query.userId) {
      return await this.walletService.getWalletAssignmentByUser(query.userId)
    }
    return await this.walletService.getWalletAssignmentByWallet(query.userId)
  }

  @Get("/balance/:address")
  getbalance(@Request() req, @Param('address') address: string) {
    this.logger.debug("getbalance for address ${address} is called by xxxx")

    return this.walletService.getBalancesByWallet(address)
  }
}
