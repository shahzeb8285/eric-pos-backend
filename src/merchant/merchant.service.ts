import { Injectable } from '@nestjs/common';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { PasswordService } from 'src/password.service';

@Injectable()
export class MerchantService {
  constructor(private prisma: PrismaService,
    private passwordService: PasswordService) { }

  
  

  async create(createMerchantDto: CreateMerchantDto) {
    const hashedPassword = await this.passwordService.hashPassword(createMerchantDto.password)
    const resp = await this.prisma.merchant.create({
      data: {
        ...createMerchantDto,
        password: hashedPassword,
        configs: {
          createMany: {
            
            data: createMerchantDto.configs
          }

        }
      },
      include: {
        configs: true,        users:true

      }
    })
    delete resp.password;

    return resp
  }

  async findAll() {
    const items = await this.prisma.merchant.findMany({
      include: {
        configs: true,
        users:true
      }
    })
    return items.map((item) => {
      delete item.password;
      return item
    })
  }


  
 
  async findOne(name: string,withPassword:boolean) {
    const resp = await this.prisma.merchant.findFirst({
      where: {
        name,
      },
      include: {
        configs: true,
        users:true

      },
      

    })
    if (!withPassword) {
      delete resp.password
    }
    return resp
  }

  async update(name: string, updateMerchantDto: UpdateMerchantDto) {

    for (const config of updateMerchantDto.configs) {
      if (!config.id) {
        await this.prisma.config.create({
          data: {
            ...config,
            merchant: {
              connect: {
                name,
              }
            }
          }
        })
      } else {
        await this.prisma.config.update({
          where: {
            id: config.id,
          },
          data: {
            ...config,

          }
        })
      }
    }


    const resp = await this.prisma.merchant.update({
      where: {
        name
      },
      data: {
        password: updateMerchantDto.password
      },

      include: {
        configs: true
      }
    })
    delete resp.password

    return resp


  }

  async remove(name: string) {
    const resp = await this.prisma.merchant.delete({
      where: {
        name,
      },
      include: {
        configs: true
      }
    })
    delete resp.password

    return resp
  }
}
