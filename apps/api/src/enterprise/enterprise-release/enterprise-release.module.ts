import {
  Module,
} from '@nestjs/common';

import {
  EnterpriseObservabilityController,
  EnterpriseReleaseController,
} from './controllers';
import {
  EnterpriseAlertEngineService,
  EnterpriseDeploymentHealthService,
  EnterpriseDisasterRecoveryService,
  EnterpriseMetricsRegistryService,
  EnterpriseNotificationRouterService,
  EnterpriseObservabilityOrchestratorService,
  EnterpriseOpenApiRegistryService,
  EnterprisePluginRegistryService,
  EnterpriseReleaseManagerService,
} from './services';

const ENTERPRISE_RELEASE_PROVIDERS = [
  EnterpriseAlertEngineService,
  EnterpriseDeploymentHealthService,
  EnterpriseDisasterRecoveryService,
  EnterpriseMetricsRegistryService,
  EnterpriseNotificationRouterService,
  EnterpriseObservabilityOrchestratorService,
  EnterpriseOpenApiRegistryService,
  EnterprisePluginRegistryService,
  EnterpriseReleaseManagerService,
] as const;

@Module({
  controllers: [
    EnterpriseObservabilityController,
    EnterpriseReleaseController,
  ],
  providers: [
    ...ENTERPRISE_RELEASE_PROVIDERS,
  ],
  exports: [
    ...ENTERPRISE_RELEASE_PROVIDERS,
  ],
})
export class EnterpriseReleaseModule {}