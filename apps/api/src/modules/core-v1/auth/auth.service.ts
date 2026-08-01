import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { timingSafeEqual } from 'node:crypto';
import { Role } from './roles';
import { LoginDto } from './login.dto';

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);

  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async login(input: LoginDto) {
    const username = this.config.getOrThrow<string>('adminUsername');
    const password = this.config.getOrThrow<string>('adminPassword');

    if (
      !safeEqual(input.username, username) ||
      !safeEqual(input.password, password)
    ) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const accessToken = await this.jwt.signAsync({
      sub: 'creatoros-bootstrap-admin',
      username,
      roles: [Role.Admin],
    });

    return {
      tokenType: 'Bearer',
      accessToken,
    };
  }
}