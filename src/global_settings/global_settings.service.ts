import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGlobalSettingDto } from './dto/create-global_setting.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class GlobalSettingsService {
  public globalSettings: CreateGlobalSettingDto 
  
  constructor(private prisma: PrismaService,) {
    this.loadSettings()
  }
  
  async loadSettings() {
    const settingsFromDb = await this.getSetting();

    this.globalSettings = settingsFromDb?JSON.parse(settingsFromDb.settings):null
  }


  getBlockchainRPC() {
    if (this.globalSettings && this.globalSettings.RPCs) {
      const rpcs = this.globalSettings.RPCs
      return rpcs[Math.floor(Math.random()*rpcs.length)];
    }

  }
  async create(data: CreateGlobalSettingDto) {
    const counts = await this.prisma.globalSettings.count();
    if (counts > 0) {
      throw new BadRequestException(
        "Settings exists, Use Update"
      )
    }
    const newSettings = await  this.prisma.globalSettings.create({
      data: {
        settings: JSON.stringify(data)
      }
    })
    this.globalSettings = JSON.parse(newSettings.settings)
    return newSettings
  }

  getSetting() {
    return this.prisma.globalSettings.findFirst()
  }



  async update(updateGlobalSettingDto: CreateGlobalSettingDto) {
    const preSettingsObj = await this.getSetting();
    const finaSettings = {
      ...JSON.parse(preSettingsObj.settings),
      ...updateGlobalSettingDto
    };

    const newSettings=  await this.prisma.globalSettings.update({
      data: {
        settings:JSON.stringify(finaSettings),
      },
      where: {
        id: preSettingsObj.id
      }
    },)

    this.globalSettings = JSON.parse(newSettings.settings)


    return newSettings
  }


}
