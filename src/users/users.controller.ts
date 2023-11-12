import { Controller, Get, Post, Request,Body, Param, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
@ApiTags("users")

export class UsersController {
  constructor(private readonly usersService: UsersService,
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  create(@Request() req , @Body() createUserDto: CreateUserDto) {
    if (req.user.isAdmin) {
      throw new UnauthorizedException("Only Merchant can create user");
    }
    return this.usersService.create(createUserDto,req.user.id);
  }


  @UseGuards(AuthGuard)
  @Get(':username')
 async findOne(@Request() req, @Param('username') username: string) {
    const user = await this.usersService.findOne(username);
    const isAuthorized = req.user.isAdmin || user.merchantId === req.user.id;

    if (!isAuthorized) {
      throw new UnauthorizedException();
    }
    return this.usersService.getAddressInfo(username);
  }


}
