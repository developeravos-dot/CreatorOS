import { ProductionHardeningService } from './hardening/production-hardening.service';
import { BackupRecoveryService } from './backup/backup-recovery.service';
import { ProductionDiagnosticsService } from './diagnostics/production-diagnostics.service';
import { ReleaseValidationService } from './release/release-validation.service';
import { FinalProductionOrchestratorService } from './final-production-orchestrator.service';

describe(
  'CreatorOS Final Production Mega Pack E',
  () => {
    function setup() {
      const hardening =
        new ProductionHardeningService();
      const backup =
        new BackupRecoveryService();
      const diagnostics =
        new ProductionDiagnosticsService(
          hardening,
          backup,
        );
      const releases =
        new ReleaseValidationService(
          hardening,
        );
      const orchestrator =
        new FinalProductionOrchestratorService(
          hardening,
          backup,
          diagnostics,
          releases,
        );

      return {
        hardening,
        backup,
        diagnostics,
        releases,
        orchestrator,
      };
    }

    it(
      'bootstraps final production systems',
      () => {
        const { orchestrator } =
          setup();

        const result =
          orchestrator.bootstrap();

        expect(result.status).toBe(
          'production-ready',
        );
        expect(
          result.metrics.readinessScore,
        ).toBe(100);
      },
    );

    it(
      'passes all hardening checks',
      () => {
        const {
          hardening,
          orchestrator,
        } = setup();

        orchestrator.bootstrap();

        const summary =
          hardening.summary();

        expect(summary.total).toBe(6);
        expect(summary.failed).toBe(0);
        expect(
          summary.productionReady,
        ).toBe(true);
      },
    );

    it(
      'creates and verifies backup',
      () => {
        const {
          backup,
          orchestrator,
        } = setup();

        orchestrator.bootstrap();

        expect(
          backup.summary().verified,
        ).toBe(1);
      },
    );

    it(
      'creates approved release manifest',
      () => {
        const {
          releases,
          orchestrator,
        } = setup();

        const result =
          orchestrator.bootstrap();

        expect(
          result.releaseManifest.approved,
        ).toBe(true);
        expect(
          releases.summary().approved,
        ).toBe(1);
      },
    );

    it(
      'reports healthy diagnostics',
      () => {
        const {
          diagnostics,
          orchestrator,
        } = setup();

        orchestrator.bootstrap();

        const snapshot =
          diagnostics.generate();

        expect(snapshot.status).toBe(
          'healthy',
        );
        expect(
          snapshot.readinessScore,
        ).toBe(100);
      },
    );

    it(
      'restores only verified backups',
      () => {
        const { backup } = setup();

        const record =
          backup.createBackup({
            name: 'manual-test',
            scope: ['configuration'],
          });

        expect(() =>
          backup.restoreBackup(record.id),
        ).toThrow(
          'Backup must be verified before restore.',
        );

        backup.verifyBackup(record.id);

        expect(
          backup.restoreBackup(record.id).status,
        ).toBe('restored');
      },
    );

    it(
      'reports all final production systems',
      () => {
        const { orchestrator } =
          setup();

        orchestrator.bootstrap();

        const status =
          orchestrator.status();

        expect(
          status.systems.productionHardening,
        ).toBe(true);
        expect(
          status.systems.backupRecovery,
        ).toBe(true);
        expect(
          status.systems.diagnostics,
        ).toBe(true);
        expect(
          status.systems.releaseValidation,
        ).toBe(true);
      },
    );
  },
);