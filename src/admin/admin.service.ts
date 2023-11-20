import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { PasswordService } from 'src/password.service';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  private logger = new Logger(AdminService.name);
  constructor(private prisma: PrismaService, private passwordService: PasswordService) { }

  async create(data: CreateAdminDto) {
    const hashedPassword = await this.passwordService.hashPassword(data.password)
    const resp = await this.prisma.admin.create({
      data: {
        ...data,
        password: hashedPassword,

      },
    })

    delete resp.password;
    return resp
  }

  async findAll() {
    const items = await this.prisma.admin.findMany({})
    return items.map((item) => {
      delete item.password;
      return item
    })
  }

  async findOne(username: string, withPassword: boolean) {
    const resp = await this.prisma.admin.findUnique({
      where: {
        username,
      },
    })
    if (!withPassword) {
      delete resp.password
    }
    return resp
  }
}
