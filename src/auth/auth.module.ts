import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MerchantModule } from 'src/merchant/merchant.module';
import { JwtModule } from '@nestjs/jwt';
import { MerchantService } from 'src/merchant/merchant.service';
import { PasswordService } from 'src/password.service';
import { AdminService } from 'src/admin/admin.service';

@Module({
  imports: [MerchantModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRY_TIME },
    }),],
  controllers: [AuthController],
  providers: [AuthService, MerchantService, PasswordService, AdminService]
})
export class AuthModule { }
