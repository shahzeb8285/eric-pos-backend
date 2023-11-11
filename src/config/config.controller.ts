import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ConfigService } from './config.service';
import { Config as ConfigModel, Prisma } from '@prisma/client';
import { CreateConfigDto } from './dto/create.config.dto';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  
  @Get('/')
  async getConfig(): Promise<ConfigModel> {
      return this.configService.getConfig();
  }





  @Post('/')
  async createConfig(
    @Body() data: CreateConfigDto
  ): Promise<ConfigModel> {
      return this.configService.createConfig(data);
  }



  @Put('/')
  async updateConfig(@Body() data: CreateConfigDto
  ): Promise<ConfigModel> {
      return this.configService.updateConfig(data);
  }
}
