import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SettlementService } from './settlement/settlement.service';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService,
    private readonly settlementService: SettlementService) {

    }

  @Get('/manualSettlement')
  async getPing() {
  this.logger.log({ level: "info", message: "Triggering manual Settlement", });
    await this.settlementService.settleWallets()
    return {message:"OK"}
  }

  @Post('/callback')
  async callBackSimulation (@Body() data) {
    console.log("callBackSimulation",data)
     return {message:"OK"}
   }
}
