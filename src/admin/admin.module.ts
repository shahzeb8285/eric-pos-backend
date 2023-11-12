import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PasswordService } from 'src/password.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService,PasswordService],
})
export class AdminModule {}
