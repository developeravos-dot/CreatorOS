import {
  Module,
} from '@nestjs/common';

import {
  EnterpriseAiOrganizationController,
  EnterpriseControlPlaneController,
  EnterpriseFabricController,
  EnterpriseOperationsConsoleController,
  EnterprisePlatformController,
} from './controllers';
import {
  EnterpriseAiOrganizationService,
  EnterpriseAuditLedgerService,
  EnterpriseCapabilityFabricService,
  EnterpriseControlPlaneService,
  EnterpriseEventBusService,
  EnterpriseGlobalSchedulerService,
  EnterpriseKnowledgeFabricService,
  EnterpriseOperationsConsoleService,
  EnterprisePlatformOrchestratorService,
  EnterprisePolicyEngineService,
  EnterpriseResourceManagerService,
  EnterpriseServiceMeshService,
} from './services';

@Module({
  controllers: [
    EnterpriseAiOrganizationController,
    EnterpriseControlPlaneController,
    EnterpriseFabricController,
    EnterpriseOperationsConsoleController,
    EnterprisePlatformController,
  ],
  providers: [
    EnterpriseAiOrganizationService,
    EnterpriseCapabilityFabricService,
    EnterpriseControlPlaneService,
    EnterpriseKnowledgeFabricService,
    EnterpriseOperationsConsoleService,
    EnterprisePolicyEngineService,
    EnterpriseResourceManagerService,
    EnterpriseServiceMeshService,
  ],
  exports: [
    EnterpriseAiOrganizationService,
    EnterpriseCapabilityFabricService,
    EnterpriseControlPlaneService,
    EnterpriseKnowledgeFabricService,
    EnterpriseOperationsConsoleService,
    EnterprisePolicyEngineService,
    EnterpriseResourceManagerService,
    EnterpriseServiceMeshService,
  ],
})
export class EnterpriseControlPlaneModule {}
