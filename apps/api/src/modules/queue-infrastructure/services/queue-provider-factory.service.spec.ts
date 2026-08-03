import {
  Test,
} from '@nestjs/testing';
import {
  BullMqQueueAdapter,
  InMemoryQueueAdapter,
} from '../adapters';
import {
  mergeQueueInfrastructureConfiguration,
} from '../configuration';
import {
  QUEUE_INFRASTRUCTURE_CONFIGURATION,
} from '../providers';
import {
  QueueConfigurationValidatorService,
} from './queue-configuration-validator.service';
import {
  QueueProviderFactoryService,
} from './queue-provider-factory.service';

describe('QueueProviderFactoryService', () => {
  it('creates the in-memory provider', async () => {
    const moduleRef =
      await Test.createTestingModule({
        providers: [
          QueueConfigurationValidatorService,
          QueueProviderFactoryService,
          {
            provide:
              QUEUE_INFRASTRUCTURE_CONFIGURATION,
            useValue:
              mergeQueueInfrastructureConfiguration({
                provider: 'memory',
              }),
          },
        ],
      }).compile();

    const factory = moduleRef.get(
      QueueProviderFactoryService,
    );

    const provider = factory.create();

    expect(provider).toBeInstanceOf(
      InMemoryQueueAdapter,
    );

    await provider.close();
  });

  it('creates the BullMQ provider', async () => {
    const moduleRef =
      await Test.createTestingModule({
        providers: [
          QueueConfigurationValidatorService,
          QueueProviderFactoryService,
          {
            provide:
              QUEUE_INFRASTRUCTURE_CONFIGURATION,
            useValue:
              mergeQueueInfrastructureConfiguration({
                provider: 'bullmq',
                redis: {
                  host: 'redis.internal',
                  port: 6379,
                  database: 0,
                  tls: false,
                  connectTimeoutMs: 5_000,
                  maxRetriesPerRequest: null,
                  enableReadyCheck: true,
                },
              }),
          },
        ],
      }).compile();

    const factory = moduleRef.get(
      QueueProviderFactoryService,
    );

    const provider = factory.create();

    expect(provider).toBeInstanceOf(
      BullMqQueueAdapter,
    );
  });

  it('returns sanitized configuration', async () => {
    const moduleRef =
      await Test.createTestingModule({
        providers: [
          QueueConfigurationValidatorService,
          QueueProviderFactoryService,
          {
            provide:
              QUEUE_INFRASTRUCTURE_CONFIGURATION,
            useValue:
              mergeQueueInfrastructureConfiguration({
                redis: {
                  host: 'redis.internal',
                  port: 6379,
                  password:
                    'super-secret-password',
                  database: 0,
                  tls: false,
                  connectTimeoutMs: 5_000,
                  maxRetriesPerRequest: null,
                  enableReadyCheck: true,
                },
              }),
          },
        ],
      }).compile();

    const factory = moduleRef.get(
      QueueProviderFactoryService,
    );

    expect(
      factory.getSanitizedConfiguration()
        .redis.password,
    ).toBe('[REDACTED]');
  });
});
