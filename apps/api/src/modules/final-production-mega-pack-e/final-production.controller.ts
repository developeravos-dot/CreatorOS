import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { FinalProductionOrchestratorService } from './final-production-orchestrator.service';
import { ProductionHardeningService } from './hardening/production-hardening.service';
import { BackupRecoveryService } from './backup/backup-recovery.service';
import { ProductionDiagnosticsService } from './diagnostics/production-diagnostics.service';
import { ReleaseValidationService } from './release/release-validation.service';

@Controller('production/final')
export class FinalProductionController {
  constructor(
    private readonly orchestrator:
      FinalProductionOrchestratorService,
    private readonly hardening:
      ProductionHardeningService,
    private readonly backup:
      BackupRecoveryService,
    private readonly diagnostics:
      ProductionDiagnosticsService,
    private readonly releases:
      ReleaseValidationService,
  ) {}

  @Post('bootstrap')
  bootstrap() {
    return this.orchestrator.bootstrap();
  }

  @Get('status')
  status() {
    return this.orchestrator.status();
  }

  @Get('checks')
  checks() {
    return this.hardening.listChecks();
  }

  @Get('diagnostics')
  diagnosticsSnapshot() {
    return this.diagnostics.generate();
  }

  @Get('backups')
  backups() {
    return this.backup.list();
  }

  @Post('backups')
  createBackup(
    @Body()
    body: {
      name: string;
      scope: string[];
    },
  ) {
    return this.backup.createBackup(body);
  }

  @Post('backups/:id/verify')
  verifyBackup(
    @Body()
    body: { id: string },
  ) {
    return this.backup.verifyBackup(body.id);
  }

  @Get('releases')
  releasesList() {
    return this.releases.list();
  }
}