import { Controller, Get, Post, Request, Body, Param, UseGuards, UnauthorizedException, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
@ApiTags("users")

@UseGuards(AuthGuard)
export class UsersController {
  private logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService,) { }

  @Post()
  create(@Request() req, @Body() createUserDto: CreateUserDto) {
    this.logger.log({ level: "info", message: `Merchant ${req.user.name} is creating user ${createUserDto.username}` });
    if (req.user.isAdmin) {
      throw new UnauthorizedException("Only Merchant can create user");
    }
    return this.usersService.create(createUserDto, req.user.id);
  }

  @Get(':username')
  async findOne(@Request() req, @Param('username') username: string) {
    this.logger.debug({ level: "debug", message: `Merchant ${req.user.name} is getting user ${username}` });
    const user = await this.usersService.findOne(username);
    const isAuthorized = req.user.isAdmin || user.merchantId === req.user.id;

    if (!isAuthorized) {
      throw new UnauthorizedException();
    }
    return this.usersService.getAddressInfo(username);
  }
}
