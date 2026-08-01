import { Module } from '@nestjs/common';
import { ProductionHardeningService } from './hardening/production-hardening.service';
import { BackupRecoveryService } from './backup/backup-recovery.service';
import { ProductionDiagnosticsService } from './diagnostics/production-diagnostics.service';
import { ReleaseValidationService } from './release/release-validation.service';
import { FinalProductionOrchestratorService } from './final-production-orchestrator.service';
import { FinalProductionController } from './final-production.controller';

@Module({
  controllers: [
    FinalProductionController,
  ],
  providers: [
    ProductionHardeningService,
    BackupRecoveryService,
    ProductionDiagnosticsService,
    ReleaseValidationService,
    FinalProductionOrchestratorService,
  ],
  exports: [
    ProductionHardeningService,
    BackupRecoveryService,
    ProductionDiagnosticsService,
    ReleaseValidationService,
    FinalProductionOrchestratorService,
  ],
})
export class FinalProductionModule {}