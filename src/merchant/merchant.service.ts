import { Injectable, BadGatewayException } from '@nestjs/common';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { PasswordService } from 'src/password.service';
import requiredMerchantConfig from './required.merchant.config';

@Injectable()
export class MerchantService {
  constructor(private prisma: PrismaService, private passwordService: PasswordService) { }

  getMissingConfigItems(configs) {
    const allConfig = [...requiredMerchantConfig]
    const providedConfigKeys = configs.map((item) => {
      return item.key
    })

    const missingItems = allConfig.filter(val => !providedConfigKeys.includes(val));
    return missingItems
  }

  async create(createMerchantDto: CreateMerchantDto) {
    const hashedPassword = await this.passwordService.hashPassword(createMerchantDto.password)

    if (!createMerchantDto.configs) {
      throw new BadGatewayException(`Merchant config does not have all required keys ${requiredMerchantConfig.toString()}`);

    }
    const missingConfigItems = this.getMissingConfigItems(createMerchantDto.configs);

    if (missingConfigItems.length > 0) {
      throw new BadGatewayException(`Merchant config does not have all required keys ${missingConfigItems.toString()}`);
    }

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
        configs: true, users: true
      }
    })
    delete resp.password;

    return resp
  }

  async findAll() {
    const items = await this.prisma.merchant.findMany({
      include: {
        configs: true,
        users: true
      }
    })
    return items.map((item) => {
      delete item.password;
      return item
    })
  }

  async getMerchantCallBackUrl(merchantId: string) {
   
    const config = await this.prisma.config.findFirst({
      where: {
        merchantId,
        key:"merchantCallBackUrl",
      }
    })
    if (config) {
      return config.value
    }
  }

  async findOne(name: string, withPassword: boolean) {
    const resp = await this.prisma.merchant.findUnique({
      where: {
        name,
      },
      include: {
        configs: true,
        users: true
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
