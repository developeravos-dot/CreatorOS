import { PersistenceService } from './persistence.service';

describe('PersistenceService', () => {
  it('should expose operational database health', async () => {
    const prisma = {
      isHealthy: jest
        .fn()
        .mockResolvedValue(true),
    };

    const service =
      new PersistenceService(prisma as never);

    const health =
      await service.getHealth();

    expect(health.status)
      .toBe('operational');

    expect(health.database)
      .toBe(true);

    expect(health.provider)
      .toBe('postgresql');

    expect(health.humanFinalAuthority)
      .toBe(true);
  });

  it('should expose unavailable status when database fails', async () => {
    const prisma = {
      isHealthy: jest
        .fn()
        .mockResolvedValue(false),
    };

    const service =
      new PersistenceService(prisma as never);

    const health =
      await service.getHealth();

    expect(health.status)
      .toBe('unavailable');

    expect(health.database)
      .toBe(false);
  });
});
