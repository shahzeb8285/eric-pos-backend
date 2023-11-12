import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags("auth")

export class AuthController { 
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('merchant_login')
    signInMerchant(@Body() data: LoginDto) {
      return this.authService.signInMerchant(data.name, data.password);
    }
  
    @HttpCode(HttpStatus.OK)
    @Post('admin_login')
    signInAdmin(@Body() data: LoginDto) {
      return this.authService.signInAdmin(data.name, data.password);
    }
}

