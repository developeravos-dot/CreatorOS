import {
  RuntimeObservabilityService,
} from './runtime-observability.service';
import {
  RuntimeProductionHardeningService,
} from './runtime-production-hardening.service';
import {
  RuntimeProductionService,
} from './runtime-production.service';
import {
  RuntimeReliabilityService,
} from './runtime-reliability.service';

describe(
  'Production runtime stress integration',
  () => {
    it(
      'handles one thousand deterministic capacity decisions',
      () => {
        const runtime =
          new RuntimeProductionService();

        const decisions = Array.from(
          {
            length: 1000,
          },
          (_, index) =>
            runtime.planCapacity({
              activeWorkers:
                1 + (index % 10),
              concurrencyPerWorker: 20,
              running:
                index % 100,
              queued:
                index % 200,
              targetUtilization: 0.8,
              maximumStep: 5,
            }),
        );

        expect(decisions)
          .toHaveLength(1000);

        expect(
          decisions.every(
            (decision) =>
              decision.desiredWorkers >= 1,
          ),
        ).toBe(true);
      },
    );

    it(
      'records high-volume metrics and checkpoints',
      () => {
        const observability =
          new RuntimeObservabilityService();

        const reliability =
          new RuntimeReliabilityService();

        for (
          let index = 0;
          index < 2000;
          index += 1
        ) {
          observability.recordMetric({
            name:
              'runtime.operation',
            value: index,
            labels: {
              worker:
                `worker-${index % 20}`,
            },
          });

          reliability.checkpoint(
            `execution-${index % 100}`,
            {
              sequence: index,
            },
          );
        }

        expect(
          observability.dashboard()
            .latestMetrics[
              'runtime.operation'
            ],
        ).toBe(1999);

        expect(
          reliability.latestCheckpoint(
            'execution-0',
          )?.version,
        ).toBe(20);
      },
    );

    it(
      'passes the production hardening gate',
      () => {
        const hardening =
          new RuntimeProductionHardeningService();

        const report =
          hardening.evaluate({
            concurrency: 300,
            operations: 250_000,
            durationMs: 25_000,
            failures: 50,
          });

        expect(report.accepted)
          .toBe(true);

        expect(
          hardening.releaseCandidate({
            testsPassed: true,
            typecheckPassed: true,
            buildPassed: true,
            whitespaceCheckPassed: true,
            hardeningAccepted:
              report.accepted,
            securityFindings:
              hardening.validateSecurity({
                secretValues: [],
                loggedValues: [],
                tenantIds: [
                  'tenant-a',
                  'tenant-b',
                ],
              }),
          }).ready,
        ).toBe(true);
      },
    );
  },
);
