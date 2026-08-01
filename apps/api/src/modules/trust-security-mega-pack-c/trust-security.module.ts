import { Module } from '@nestjs/common';
import { IdentityAccessService } from './identity/identity-access.service';
import { SecurityPlatformService } from './security/security-platform.service';
import { MonitoringObservabilityService } from './observability/monitoring-observability.service';
import { TrustSecurityOrchestratorService } from './trust-security-orchestrator.service';
import { TrustSecurityController } from './trust-security.controller';

@Module({
  controllers: [
    TrustSecurityController,
  ],
  providers: [
    IdentityAccessService,
    SecurityPlatformService,
    MonitoringObservabilityService,
    TrustSecurityOrchestratorService,
  ],
  exports: [
    IdentityAccessService,
    SecurityPlatformService,
    MonitoringObservabilityService,
    TrustSecurityOrchestratorService,
  ],
})
export class TrustSecurityModule {}