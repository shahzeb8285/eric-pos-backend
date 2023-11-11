import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Config, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ConfigService {
    constructor(private prisma: PrismaService) { }

    async getConfig(): Promise<Config | null> {
        return this.prisma.config.findFirst()
    }


    async createConfig(data: Prisma.ConfigCreateInput): Promise<Config> {
        const counts = await this.prisma.config.count()

        if (counts > 0) {
            throw new HttpException('Config Already Created! You can only update the config', HttpStatus.BAD_REQUEST);

        }
        return this.prisma.config.create({
            data,
        });
    }

    async updateConfig(data: Prisma.ConfigUpdateInput): Promise<Config> {
        const config = await this.getConfig()
        return this.prisma.config.update({
            data,
            where: {
                id: config.id
            },
        });
    }

   
}