import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { SettlementService } from './settlement/settlement.service';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService,
    private readonly settlementServide: SettlementService) { }

  @Get('/manualSettlement')
 async getPing() {
  this.logger.log({ level: "info", message: "Triggering manual Settlement", });
    await this.settlementServide.settleWallets()
    return {message:"OK"}
  }
}
