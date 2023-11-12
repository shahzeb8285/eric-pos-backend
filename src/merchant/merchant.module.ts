import { Module } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { MerchantController } from './merchant.controller';
import { PasswordService } from 'src/password.service';

@Module({
  controllers: [MerchantController],
  providers: [MerchantService,PasswordService],
})
export class MerchantModule {}
