import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './public.decorator';
import { AuthUser } from './auth-user';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /*
     * CREATOROS_DEV_AUTH_BYPASS
     * Development only. Production remains protected.
     */
    const devAuthBypass =
      process.env.NODE_ENV !== 'production' &&
      process.env.CREATOROS_DEV_AUTH_BYPASS === 'true';

    if (devAuthBypass) {
      const request =
        context.switchToHttp().getRequest();

      request.user = request.user ?? {
        sub: 'creatoros-development-admin',
        id: 'creatoros-development-admin',
        email: 'admin@creatoros.local',
        role: 'admin',
        roles: ['admin'],
        permissions: ['*'],
        type: 'development',
        authenticationMode: 'development-bypass',
      };

      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
      user?: AuthUser;
    }>();

    const authorization = request.headers.authorization;

    if (
      typeof authorization !== 'string' ||
      !authorization.startsWith('Bearer ')
    ) {
      throw new UnauthorizedException('Bearer token is required.');
    }

    try {
      request.user = await this.jwt.verifyAsync<AuthUser>(
        authorization.slice(7),
      );
      return true;
    }
    catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
