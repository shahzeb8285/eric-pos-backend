import { Controller, Get, Post, Body, Request, Param, Delete, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('admin')
@ApiTags("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Post()
  @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  create(@Request() req, @Body() createAdminDto: CreateAdminDto) {
    // if (!req.user.isAdmin) {
    //   throw new UnauthorizedException();
    // }
    return this.adminService.create(createAdminDto);
  }

  @Get(':username')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  findAll(@Request() req) {
    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.adminService.findAll();
  }

  @Get(':username')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  findOne(@Request() req, @Param('username') username: string) {

    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.adminService.findOne(username, false);
  }




}
