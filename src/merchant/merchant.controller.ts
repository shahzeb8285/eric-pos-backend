import { Controller, Get, Post, Request,Body, Patch, Param, Delete, UseGuards, UnauthorizedException, Logger } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('merchant')
@ApiTags("merchant")
export class MerchantController {
  private logger = new Logger(MerchantController.name);
  constructor(private readonly merchantService: MerchantService) {}

  @Post()
  create(@Request() req, @Body() createMerchantDto: CreateMerchantDto) {
    this.logger.log({ level: "info", message: `Admin ${req.user.name} is creating merchant ${createMerchantDto.name}` });
    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.merchantService.create(createMerchantDto);
  }

  @Get("")
  findAll(@Request() req,) {
    this.logger.debug({ level: "debug", message: `Admin ${req.user.name} is getting all merchants` });
    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.merchantService.findAll();
  }

  @Get(':name')
  findOne(@Request() req,@Param('name') name: string) {
    this.logger.debug({ level: "debug", message: `Admin ${req.user.name} is getting merchant ${name}` });
    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.merchantService.findOne(name,false);
  }

  @Patch(':name')
  update(@Request() req,@Param('name') name: string, @Body() updateMerchantDto: UpdateMerchantDto) {
    this.logger.log({ level: "info", message: `Admin ${req.user.name} is updating merchant ${name}` });
    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.merchantService.update(name, updateMerchantDto);
  }

  @Delete(':name')
  remove(@Request() req,@Param('name') name: string) {
    this.logger.warn({ level: "warn", message: `Admin ${req.user.name} is deleting merchant ${name}` });
    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.merchantService.remove(name);
  }
}
