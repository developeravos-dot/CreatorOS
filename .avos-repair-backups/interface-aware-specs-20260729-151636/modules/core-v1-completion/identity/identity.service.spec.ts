import { IdentityService } from './identity.service';

describe('IdentityService', () => {
  it('creates a user with a hashed password', async () => {
    const persistence = {
      creatorUser: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({
          id: 'user-1',
          username: 'tester',
        }),
      },
    };

    const service = new IdentityService(persistence as never);

    await service.createUser({
      username: 'tester',
      email: 'tester@example.com',
      password: 'very-strong-password',
    });

    expect(persistence.creatorUser.create).toHaveBeenCalled();
    const call = persistence.creatorUser.create.mock.calls[0][0];
    expect(call.data.passwordHash).not.toBe(
      'very-strong-password',
    );
  });
});