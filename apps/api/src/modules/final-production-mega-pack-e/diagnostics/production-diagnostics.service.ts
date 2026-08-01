import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DiagnosticSnapshot } from '../final-production.types';
import { ProductionHardeningService } from '../hardening/production-hardening.service';
import { BackupRecoveryService } from '../backup/backup-recovery.service';

@Injectable()
export class ProductionDiagnosticsService {
  constructor(
    private readonly hardening:
      ProductionHardeningService,
    private readonly backup:
      BackupRecoveryService,
  ) {}

  generate(): DiagnosticSnapshot {
    const hardening =
      this.hardening.summary();

    const backup =
      this.backup.summary();

    const readinessScore = Math.max(
      0,
      Math.min(
        100,
        (hardening.productionReady ? 80 : 20) +
          (backup.verified > 0 ? 20 : 0),
      ),
    );

    return {
      id: randomUUID(),
      status:
        readinessScore >= 90
          ? 'healthy'
          : readinessScore >= 60
            ? 'degraded'
            : 'unhealthy',
      components: {
        hardening:
          hardening.productionReady
            ? 'ready'
            : 'not-ready',
        backup:
          backup.verified > 0
            ? 'verified'
            : 'missing-verification',
        releaseValidation:
          hardening.criticalFailed === 0
            ? 'ready'
            : 'blocked',
      },
      readinessScore,
      generatedAt: new Date().toISOString(),
    };
  }
}