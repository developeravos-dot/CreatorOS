import {
  Module,
} from '@nestjs/common';

import {
  RuntimeProductionModule,
} from './production';
import {
  DistributedRetryEngineService,
  DistributedWorkerRuntimeService,
  ExecutionEventBusService,
  ExecutionLeaseManagerService,
  ExecutionRuntimeCoordinatorService,
  LostWorkerRecoveryService,
  RuntimeRebalancingService,
  RuntimeTelemetryService,
  WorkerFailureDetectorService,
} from './services';

const DISTRIBUTED_RUNTIME_PROVIDERS = [
  DistributedWorkerRuntimeService,
  ExecutionLeaseManagerService,
  ExecutionRuntimeCoordinatorService,
  WorkerFailureDetectorService,
  LostWorkerRecoveryService,
  DistributedRetryEngineService,
  RuntimeRebalancingService,
  ExecutionEventBusService,
  RuntimeTelemetryService,
] as const;

@Module({
  imports: [
    RuntimeProductionModule,
  ],
  providers: [
    ...DISTRIBUTED_RUNTIME_PROVIDERS,
  ],
  exports: [
    ...DISTRIBUTED_RUNTIME_PROVIDERS,
    RuntimeProductionModule,
  ],
})
export class DistributedRuntimeModule {}
