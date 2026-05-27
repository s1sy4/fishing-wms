import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(email: string, password: string, name: string, role = 'operator') {
    const hash = await bcrypt.hash(password, 10);
    const user = await this.prisma.employee.create({
      data: { email, password: hash, name, role },
    });
    return this.signToken(user);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.employee.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Неверные данные');
    }
    return this.signToken(user);
  }

  private signToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwt.sign(payload) };
  }
}