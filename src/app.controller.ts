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
    await this.settlementServide.settleWallets()
    this.logger.log({ level: "warn", message: "This is warn level", });
    return {message:"OK"}
  }
}
