import {
  DynamicModule,
  Module,
} from '@nestjs/common';

import {
  ClusterCoordinationStateService,
  ClusterJobOwnershipService,
  ClusterLeaderElectionService,
  ClusterLockService,
  ClusterMembershipService,
  ClusterMonitoringService,
  ClusterSchedulerService,
} from './services';
import {
  RedisClusterModule,
  type RedisClusterModuleOptions,
} from './redis';

const CLUSTER_PROVIDERS = [
  ClusterMembershipService,
  ClusterLeaderElectionService,
  ClusterLockService,
  ClusterCoordinationStateService,
  ClusterSchedulerService,
  ClusterJobOwnershipService,
  ClusterMonitoringService,
] as const;

@Module({
  providers: [
    ...CLUSTER_PROVIDERS,
  ],
  exports: [
    ...CLUSTER_PROVIDERS,
  ],
})
export class ClusterModule {
  static forRedis(
    options: RedisClusterModuleOptions,
  ): DynamicModule {
    return {
      module: ClusterModule,
      imports: [
        RedisClusterModule.forRoot(
          options,
        ),
      ],
      providers: [
        ...CLUSTER_PROVIDERS,
      ],
      exports: [
        ...CLUSTER_PROVIDERS,
        RedisClusterModule,
      ],
    };
  }
}