import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Logger } from 'winston';

@Module({
  controllers: [WalletController],
  providers: [WalletService,Logger],
})
export class WalletModule {}
