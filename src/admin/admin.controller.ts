import { Controller, Get, Post, Body, Request, Param, Delete, UseGuards, UnauthorizedException, Logger } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('admin')
@ApiTags("admin")
export class AdminController {
  private logger = new Logger(AdminController.name);
  constructor(private readonly adminService: AdminService) { }

  @Post()
  create(@Request() req, @Body() createAdminDto: CreateAdminDto) {
    this.logger.log({ level: "info", message: `Creating new admin ${createAdminDto.username}` });
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Request() req) {
    this.logger.log({ level: "debug", message: `Retrieving all admins` });

    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.adminService.findAll();
  }

  @Get(':username')
  @UseGuards(AuthGuard)
  findOne(@Request() req, @Param('username') username: string) {
    this.logger.log({ level: "debug", message: `Finding admin ${username}` });

    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.adminService.findOne(username, false);
  }
}
