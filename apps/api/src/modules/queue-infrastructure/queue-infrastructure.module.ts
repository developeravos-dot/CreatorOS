import {
  DynamicModule,
  Module,
} from '@nestjs/common';
import {
  BullMqWorkerAdapter,
  InMemoryWorkerAdapter,
} from './adapters';
import {
  mergeQueueInfrastructureConfiguration,
  QueueInfrastructureConfiguration,
} from './configuration';
import {
  QueueHealthController,
} from './controllers';
import {
  QUEUE_HEALTH_PROVIDER,
  QUEUE_INFRASTRUCTURE_CONFIGURATION,
  QUEUE_PROVIDER,
  QUEUE_WORKER_PROVIDER,
} from './providers';
import {
  QueueConfigurationValidatorService,
  QueueHealthService,
  QueueProviderFactoryService,
  QueueWorkerRegistryService,
} from './services';

const createQueueProvider = (
  factory: QueueProviderFactoryService,
) => factory.create();

const createWorkerProvider = (
  configuration:
    QueueInfrastructureConfiguration,
) =>
  configuration.provider === 'bullmq'
    ? new BullMqWorkerAdapter(configuration)
    : new InMemoryWorkerAdapter();

@Module({
  controllers: [
    QueueHealthController,
  ],
  providers: [
    QueueConfigurationValidatorService,
    QueueProviderFactoryService,
    QueueWorkerRegistryService,
    QueueHealthService,
    {
      provide:
        QUEUE_INFRASTRUCTURE_CONFIGURATION,
      useValue:
        mergeQueueInfrastructureConfiguration({}),
    },
    {
      provide: QUEUE_PROVIDER,
      useFactory: createQueueProvider,
      inject: [
        QueueProviderFactoryService,
      ],
    },
    {
      provide: QUEUE_WORKER_PROVIDER,
      useFactory: createWorkerProvider,
      inject: [
        QUEUE_INFRASTRUCTURE_CONFIGURATION,
      ],
    },
    {
      provide: QUEUE_HEALTH_PROVIDER,
      useExisting: QUEUE_PROVIDER,
    },
  ],
  exports: [
    QUEUE_INFRASTRUCTURE_CONFIGURATION,
    QUEUE_PROVIDER,
    QUEUE_WORKER_PROVIDER,
    QUEUE_HEALTH_PROVIDER,
    QueueConfigurationValidatorService,
    QueueProviderFactoryService,
    QueueWorkerRegistryService,
    QueueHealthService,
  ],
})
export class QueueInfrastructureModule {
  static forRoot(
    configuration:
      Partial<QueueInfrastructureConfiguration> = {},
  ): DynamicModule {
    const mergedConfiguration =
      mergeQueueInfrastructureConfiguration(
        configuration,
      );

    return {
      module: QueueInfrastructureModule,
      controllers: [
        QueueHealthController,
      ],
      providers: [
        QueueConfigurationValidatorService,
        QueueProviderFactoryService,
        QueueWorkerRegistryService,
        QueueHealthService,
        {
          provide:
            QUEUE_INFRASTRUCTURE_CONFIGURATION,
          useValue: mergedConfiguration,
        },
        {
          provide: QUEUE_PROVIDER,
          useFactory: createQueueProvider,
          inject: [
            QueueProviderFactoryService,
          ],
        },
        {
          provide: QUEUE_WORKER_PROVIDER,
          useFactory: createWorkerProvider,
          inject: [
            QUEUE_INFRASTRUCTURE_CONFIGURATION,
          ],
        },
        {
          provide: QUEUE_HEALTH_PROVIDER,
          useExisting: QUEUE_PROVIDER,
        },
      ],
      exports: [
        QUEUE_INFRASTRUCTURE_CONFIGURATION,
        QUEUE_PROVIDER,
        QUEUE_WORKER_PROVIDER,
        QUEUE_HEALTH_PROVIDER,
        QueueWorkerRegistryService,
        QueueHealthService,
      ],
    };
  }
}
