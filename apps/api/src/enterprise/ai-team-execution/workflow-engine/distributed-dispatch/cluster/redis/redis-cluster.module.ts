import {
  DynamicModule,
  Module,
  Provider,
} from '@nestjs/common';

import type {
  RedisConnectionConfiguration,
} from '../../../../../../modules/queue-infrastructure/configuration';
import {
  IORedisConnectionAdapter,
} from '../../../../../../modules/queue-infrastructure/redis';
import {
  IORedisClusterStoreClientAdapter,
} from './adapters';
import {
  RedisClusterKeyFactory,
} from './key-factory';
import {
  RedisClusterNamespace,
} from './namespace';
import {
  RedisClusterLockStore,
  RedisClusterMonitoringService,
  RedisCoordinationStateStore,
  RedisJobOwnershipStore,
  RedisLeaderElectionStore,
  RedisLostNodeRecoveryService,
  RedisMembershipStore,
  RedisSchedulerClaimStore,
} from './stores';
import {
  REDIS_CLUSTER_CONNECTION,
  REDIS_CLUSTER_KEY_FACTORY,
  REDIS_CLUSTER_NAMESPACE,
  REDIS_CLUSTER_OPTIONS,
  REDIS_CLUSTER_STORE_CLIENT,
} from './tokens';

export interface RedisClusterNamespaceOptions {
  readonly application: string;
  readonly environment: string;
  readonly clusterId: string;
}

export interface RedisClusterModuleOptions {
  readonly connection:
    RedisConnectionConfiguration;
  readonly namespace:
    RedisClusterNamespaceOptions;
}

const exportsList = [
  REDIS_CLUSTER_OPTIONS,
  REDIS_CLUSTER_CONNECTION,
  REDIS_CLUSTER_STORE_CLIENT,
  REDIS_CLUSTER_NAMESPACE,
  REDIS_CLUSTER_KEY_FACTORY,
  IORedisClusterStoreClientAdapter,
  RedisMembershipStore,
  RedisLeaderElectionStore,
  RedisClusterLockStore,
  RedisCoordinationStateStore,
  RedisSchedulerClaimStore,
  RedisJobOwnershipStore,
  RedisLostNodeRecoveryService,
  RedisClusterMonitoringService,
] as const;

const createProviders = (
  options: RedisClusterModuleOptions,
): Provider[] => [
  {
    provide: REDIS_CLUSTER_OPTIONS,
    useValue: Object.freeze({
      connection: Object.freeze({
        ...options.connection,
      }),
      namespace: Object.freeze({
        ...options.namespace,
      }),
    }),
  },
  {
    provide: REDIS_CLUSTER_CONNECTION,
    useFactory: () =>
      new IORedisConnectionAdapter({
        ...options.connection,
      }),
  },
  IORedisClusterStoreClientAdapter,
  {
    provide: REDIS_CLUSTER_STORE_CLIENT,
    useExisting:
      IORedisClusterStoreClientAdapter,
  },
  {
    provide: REDIS_CLUSTER_NAMESPACE,
    useFactory: () =>
      new RedisClusterNamespace({
        ...options.namespace,
      }),
  },
  {
    provide: REDIS_CLUSTER_KEY_FACTORY,
    useFactory: (
      namespace: RedisClusterNamespace,
    ) =>
      new RedisClusterKeyFactory(
        namespace,
      ),
    inject: [
      REDIS_CLUSTER_NAMESPACE,
    ],
  },
  {
    provide: RedisMembershipStore,
    useFactory: (
      client: IORedisClusterStoreClientAdapter,
      keys: RedisClusterKeyFactory,
    ) =>
      new RedisMembershipStore(client, keys),
    inject: [
      REDIS_CLUSTER_STORE_CLIENT,
      REDIS_CLUSTER_KEY_FACTORY,
    ],
  },
  {
    provide: RedisLeaderElectionStore,
    useFactory: (
      client: IORedisClusterStoreClientAdapter,
      keys: RedisClusterKeyFactory,
    ) =>
      new RedisLeaderElectionStore(client, keys),
    inject: [
      REDIS_CLUSTER_STORE_CLIENT,
      REDIS_CLUSTER_KEY_FACTORY,
    ],
  },
  {
    provide: RedisClusterLockStore,
    useFactory: (
      client: IORedisClusterStoreClientAdapter,
      keys: RedisClusterKeyFactory,
    ) =>
      new RedisClusterLockStore(client, keys),
    inject: [
      REDIS_CLUSTER_STORE_CLIENT,
      REDIS_CLUSTER_KEY_FACTORY,
    ],
  },
  {
    provide: RedisCoordinationStateStore,
    useFactory: (
      client: IORedisClusterStoreClientAdapter,
      keys: RedisClusterKeyFactory,
    ) =>
      new RedisCoordinationStateStore(client, keys),
    inject: [
      REDIS_CLUSTER_STORE_CLIENT,
      REDIS_CLUSTER_KEY_FACTORY,
    ],
  },
  {
    provide: RedisSchedulerClaimStore,
    useFactory: (
      client: IORedisClusterStoreClientAdapter,
      keys: RedisClusterKeyFactory,
    ) =>
      new RedisSchedulerClaimStore(client, keys),
    inject: [
      REDIS_CLUSTER_STORE_CLIENT,
      REDIS_CLUSTER_KEY_FACTORY,
    ],
  },
  {
    provide: RedisJobOwnershipStore,
    useFactory: (
      client: IORedisClusterStoreClientAdapter,
      keys: RedisClusterKeyFactory,
    ) =>
      new RedisJobOwnershipStore(client, keys),
    inject: [
      REDIS_CLUSTER_STORE_CLIENT,
      REDIS_CLUSTER_KEY_FACTORY,
    ],
  },
  {
    provide: RedisLostNodeRecoveryService,
    useFactory: (
      membership: RedisMembershipStore,
      ownership: RedisJobOwnershipStore,
    ) =>
      new RedisLostNodeRecoveryService(
        membership,
        ownership,
      ),
    inject: [
      RedisMembershipStore,
      RedisJobOwnershipStore,
    ],
  },
  {
    provide: RedisClusterMonitoringService,
    useFactory: (
      client: IORedisClusterStoreClientAdapter,
      keys: RedisClusterKeyFactory,
      membership: RedisMembershipStore,
      leaders: RedisLeaderElectionStore,
      ownership: RedisJobOwnershipStore,
      claims: RedisSchedulerClaimStore,
    ) =>
      new RedisClusterMonitoringService(
        client,
        keys,
        membership,
        leaders,
        ownership,
        claims,
      ),
    inject: [
      REDIS_CLUSTER_STORE_CLIENT,
      REDIS_CLUSTER_KEY_FACTORY,
      RedisMembershipStore,
      RedisLeaderElectionStore,
      RedisJobOwnershipStore,
      RedisSchedulerClaimStore,
    ],
  },
];

@Module({})
export class RedisClusterModule {
  static forRoot(
    options: RedisClusterModuleOptions,
  ): DynamicModule {
    return {
      module: RedisClusterModule,
      providers: createProviders(options),
      exports: [
        ...exportsList,
      ],
    };
  }
}
