import {
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  BullMqQueueAdapter,
  InMemoryQueueAdapter,
} from '../adapters';
import {
  QueueInfrastructureConfiguration,
} from '../configuration';
import {
  QueueProvider,
} from '../contracts';
import {
  QUEUE_INFRASTRUCTURE_CONFIGURATION,
} from '../providers';
import {
  IORedisConnectionAdapter,
} from '../redis';
import {
  QueueConfigurationValidatorService,
} from './queue-configuration-validator.service';

@Injectable()
export class QueueProviderFactoryService {
  constructor(
    @Inject(
      QUEUE_INFRASTRUCTURE_CONFIGURATION,
    )
    private readonly configuration:
      QueueInfrastructureConfiguration,
    private readonly validator:
      QueueConfigurationValidatorService,
  ) {}

  create(): QueueProvider {
    this.validator.assertValid(
      this.configuration,
    );

    switch (this.configuration.provider) {
      case 'memory':
        return new InMemoryQueueAdapter();

      case 'bullmq': {
        const redis =
          new IORedisConnectionAdapter(
            this.configuration.redis,
          );

        return new BullMqQueueAdapter(
          this.configuration,
          redis,
        );
      }

      default:
        return this.assertNever(
          this.configuration.provider,
        );
    }
  }

  getSanitizedConfiguration():
    QueueInfrastructureConfiguration {
    return this.validator.sanitize(
      this.configuration,
    );
  }

  private assertNever(value: never): never {
    throw new Error(
      `Unsupported queue provider: ${String(value)}`,
    );
  }
}
