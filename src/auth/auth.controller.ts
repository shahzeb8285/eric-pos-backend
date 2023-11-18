import { Body, Controller, Post, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags("auth")
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('merchant_login')
  signInMerchant(@Body() data: LoginDto) {
    this.logger.log({ level: "debug", message: `Merchant ${data.name} is logging in` });
    return this.authService.signInMerchant(data.name, data.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('admin_login')
  signInAdmin(@Body() data: LoginDto) {
    this.logger.log({ level: "debug", message: `Admin ${data.name} is logging in` });
    return this.authService.signInAdmin(data.name, data.password);
  }
}

