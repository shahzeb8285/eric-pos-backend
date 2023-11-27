
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MerchantService } from 'src/merchant/merchant.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/password.service';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class AuthService {
  constructor(private merchantService: MerchantService,
    private adminService: AdminService,
    private jwtService: JwtService,
    private passwordService: PasswordService
  ) { }

  async generateJWT(userId: string, name: string, isAdmin: boolean) {
    const payload = {
      id: userId,
      name,
      isAdmin,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signInMerchant(username: string, pass: string): Promise<any> {
    const user = await this.merchantService.findOne(username, true);
    if (!user) {
      throw new UnauthorizedException("Account not found")
    }
   
    const isPasswordValid = await this.passwordService.validatePassword(pass, user.password,)

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    return this.generateJWT(user.id, user.name, false)
  }

  async signInAdmin(username: string, pass: string): Promise<any> {
    const user = await this.adminService.findOne(username, true);
    if (!user) {
      throw new UnauthorizedException("Account not found")
    }

    const isPasswordValid = await this.passwordService.validatePassword(pass, user.password,)
    
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    return this.generateJWT(user.id, user.username, true)
  }
}