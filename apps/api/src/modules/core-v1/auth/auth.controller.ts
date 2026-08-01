import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { Public } from './public.decorator';
import { AuthUser } from './auth-user';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() input: LoginDto) {
    return this.auth.login(input);
  }

  @ApiBearerAuth()
  @Get('me')
  me(@Req() request: { user: AuthUser }) {
    return request.user;
  }
}