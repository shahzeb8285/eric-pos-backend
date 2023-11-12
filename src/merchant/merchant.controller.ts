import { Controller, Get, Post, Request,Body, Patch, Param, Delete, UseGuards, UnauthorizedException } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('merchant')
@ApiTags("merchant")
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() createMerchantDto: CreateMerchantDto) {
    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.merchantService.create(createMerchantDto);
  }

  @UseGuards(AuthGuard)
  @Get("")
  @ApiBearerAuth()
  findAll(@Request() req,) {
    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.merchantService.findAll();
  }


 
  @Get(':name')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  findOne(@Request() req,@Param('name') name: string) {
    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.merchantService.findOne(name,false);
  }

  @Patch(':name')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  update(@Request() req,@Param('name') name: string, @Body() updateMerchantDto: UpdateMerchantDto) {
    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.merchantService.update(name, updateMerchantDto);
  }

  @Delete(':name')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  remove(@Request() req,@Param('name') name: string) {
    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.merchantService.remove(name);
  }
}
