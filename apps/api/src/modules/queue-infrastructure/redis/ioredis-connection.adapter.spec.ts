import {
  Redis as IORedisClient,
} from 'ioredis';
import {
  mergeQueueInfrastructureConfiguration,
} from '../configuration';
import {
  IORedisConnectionAdapter,
} from './ioredis-connection.adapter';

describe('IORedisConnectionAdapter', () => {
  it('connects, pings and disconnects', async () => {
    const client = {
      status: 'wait',
      connect: jest.fn().mockResolvedValue(undefined),
      ping: jest.fn().mockResolvedValue('PONG'),
      quit: jest.fn().mockResolvedValue('OK'),
    } as unknown as IORedisClient;

    const configuration =
      mergeQueueInfrastructureConfiguration({})
        .redis;

    const adapter =
      new IORedisConnectionAdapter(
        configuration,
        () => client,
      );

    await adapter.connect();

    expect(adapter.status).toBe('connected');
    expect(client.connect).toHaveBeenCalledTimes(1);
    expect(client.ping).toHaveBeenCalled();

    const health = await adapter.getHealth();

    expect(health.connected).toBe(true);
    expect(health.status).toBe('connected');

    await adapter.disconnect();

    expect(adapter.status).toBe('closed');
    expect(client.quit).toHaveBeenCalledTimes(1);
  });

  it('returns unhealthy state after Redis failure', async () => {
    const client = {
      status: 'wait',
      connect: jest.fn().mockRejectedValue(
        new Error('Redis unavailable'),
      ),
      ping: jest.fn(),
      quit: jest.fn(),
    } as unknown as IORedisClient;

    const adapter =
      new IORedisConnectionAdapter(
        mergeQueueInfrastructureConfiguration({})
          .redis,
        () => client,
      );

    const health = await adapter.getHealth();

    expect(health).toEqual(
      expect.objectContaining({
        status: 'failed',
        connected: false,
        error: 'Redis unavailable',
      }),
    );
  });

  it('duplicates connection configuration', () => {
    const configuration =
      mergeQueueInfrastructureConfiguration({
        redis: {
          host: 'redis.internal',
          port: 6380,
          database: 2,
          tls: true,
          connectTimeoutMs: 10_000,
          maxRetriesPerRequest: 3,
          enableReadyCheck: false,
        },
      }).redis;

    const adapter =
      new IORedisConnectionAdapter(
        configuration,
        () => {
          throw new Error(
            'Client creation is not expected.',
          );
        },
      );

    const duplicated = adapter.duplicate();

    expect(duplicated).not.toBe(adapter);

    expect(duplicated.configuration).toEqual(
      configuration,
    );
  });
});
