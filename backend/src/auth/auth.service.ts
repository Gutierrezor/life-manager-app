import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const email = registerDto.email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (existing) {
      throw new BadRequestException('Ya existe una cuenta con este correo');
    }

    const password = await bcrypt.hash(registerDto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name.trim(),
        email,
        password,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return this.createSession(user);
  }

  async login(loginDto: LoginDto) {
    const email = loginDto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isValid = await bcrypt.compare(loginDto.password, user.password);
    const needsPasswordMigration = !isValid && user.password === loginDto.password;

    if (!isValid && !needsPasswordMigration) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (needsPasswordMigration) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: await bcrypt.hash(loginDto.password, 12) },
      });
    }

    return this.createSession({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  private async createSession(user: { id: number; name: string; email: string }) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      accessToken,
      user,
    };
  }
}
