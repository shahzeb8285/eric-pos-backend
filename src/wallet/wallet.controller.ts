import { Controller, Get, Param} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('wallet')
@ApiTags("wallet")
export class WalletController {
  constructor(private readonly walletService: WalletService) {}


  @Get()
  findAll() {
    return this.walletService.findAll();
  }


  @Get("/balance/:address")
  getbalance(@Param('address') address: string) {
    return this.walletService.getBalancesByWallet(address)
  }




}
