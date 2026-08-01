import { PrismaService } from '../../persistence/prisma.service';
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
function digest(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

@Injectable()
export class RefreshTokenService {
  constructor(private readonly persistence: PrismaService) {}

  async issue(userId: string) {
    const token = randomBytes(48).toString('base64url');
    const tokenHash = digest(token);
    const expiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    );

    await this.persistence.creatorRefreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return {
      refreshToken: token,
      expiresAt,
    };
  }

  async rotate(token: string) {
    const tokenHash = digest(token);

    const stored =
      await this.persistence.creatorRefreshToken.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

    if (
      !stored ||
      stored.revokedAt ||
      stored.expiresAt.getTime() <= Date.now()
    ) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    await this.persistence.creatorRefreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const next = await this.issue(stored.userId);

    return {
      user: {
        id: stored.user.id,
        username: stored.user.username,
      },
      ...next,
    };
  }

  async revoke(token: string) {
    const tokenHash = digest(token);

    await this.persistence.creatorRefreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}