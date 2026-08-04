import {
  RuntimeProductionHardeningService,
} from './runtime-production-hardening.service';

describe(
  'RuntimeProductionHardeningService',
  () => {
    it(
      'accepts a healthy production load profile',
      () => {
        const service =
          new RuntimeProductionHardeningService();

        const report =
          service.evaluate({
            concurrency: 200,
            operations: 100_000,
            durationMs: 10_000,
            failures: 10,
          });

        expect(report.accepted)
          .toBe(true);

        expect(
          report.throughputPerSecond,
        ).toBe(10_000);
      },
    );

    it(
      'rejects unsafe load and leaked secrets',
      () => {
        const service =
          new RuntimeProductionHardeningService();

        const report =
          service.evaluate({
            concurrency: 750,
            operations: 1000,
            durationMs: 10_000,
            failures: 25,
          });

        expect(report.accepted)
          .toBe(false);

        expect(
          service.validateSecurity({
            secretValues: [
              'super-secret',
            ],
            loggedValues: [
              'token=super-secret',
            ],
            tenantIds: [
              'tenant-a',
              'tenant-a',
            ],
          }),
        ).toHaveLength(2);
      },
    );

    it(
      'produces a release candidate decision',
      () => {
        const service =
          new RuntimeProductionHardeningService();

        expect(
          service.releaseCandidate({
            testsPassed: true,
            typecheckPassed: true,
            buildPassed: true,
            whitespaceCheckPassed: true,
            hardeningAccepted: true,
            securityFindings: [],
          }),
        ).toEqual({
          ready: true,
          blockers: [],
        });
      },
    );
  },
);
