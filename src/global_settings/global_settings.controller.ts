import { Controller, Get, Post,Request, Body, Patch, Param, Delete, UseGuards, UnauthorizedException } from '@nestjs/common';
import { GlobalSettingsService } from './global_settings.service';
import { CreateGlobalSettingDto } from './dto/create-global_setting.dto';
import { UpdateGlobalSettingDto } from './dto/update-global_setting.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('global-settings')
@ApiTags("global-settings")
@ApiBearerAuth()

export class GlobalSettingsController {
   
  constructor(private readonly globalSettingsService: GlobalSettingsService) {
   
  }
  

 

  

  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() req, @Body() createGlobalSettingDto: CreateGlobalSettingDto) {
    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
     
    const newSettings = await this.globalSettingsService.create(createGlobalSettingDto);
    return newSettings
  }

  @UseGuards(AuthGuard)
  @Get()
  find(@Request() req, ) {
    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.globalSettingsService.getSetting();
  }

  

  @UseGuards(AuthGuard)
  @Patch('')
  async update(@Request() req, @Body() updateGlobalSettingDto: CreateGlobalSettingDto) {
    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    const newSettings = await  this.globalSettingsService.update(updateGlobalSettingDto);
    return newSettings
  }

 
}
