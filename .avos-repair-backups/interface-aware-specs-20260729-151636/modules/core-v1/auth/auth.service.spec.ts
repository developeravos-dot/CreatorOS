import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const config = {
    getOrThrow: jest.fn((key: string) => {
      if (key === 'adminUsername') return 'admin';
      if (key === 'adminPassword') return 'password123';
      throw new Error(`Unexpected key: ${key}`);
    }),
  };

  const jwt = {
    signAsync: jest.fn().mockResolvedValue('signed-token'),
  };

  const service = new AuthService(
    config as never,
    jwt as never,
  );

  it('issues a token for valid credentials', async () => {
    await expect(
      service.login({
        username: 'admin',
        password: 'password123',
      }),
    ).resolves.toEqual({
      tokenType: 'Bearer',
      accessToken: 'signed-token',
    });
  });

  it('rejects invalid credentials', async () => {
    await expect(
      service.login({
        username: 'admin',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});