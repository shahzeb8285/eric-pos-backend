import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WalletService } from 'src/wallet/wallet.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly walletService: WalletService,
  ) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

 

  @Get('getAddress/:username')
  findOne(@Param('username') username: string) {
    return this.usersService.getAddressInfo(username);
  }

  


}
