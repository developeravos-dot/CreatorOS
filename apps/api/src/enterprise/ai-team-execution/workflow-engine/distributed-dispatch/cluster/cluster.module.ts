import {
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
export class ClusterModule {}