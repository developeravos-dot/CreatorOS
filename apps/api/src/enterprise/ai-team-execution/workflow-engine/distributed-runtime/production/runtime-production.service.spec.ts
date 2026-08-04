import {
  RuntimeProductionService,
} from './runtime-production.service';

describe(
  'RuntimeProductionService',
  () => {
    it(
      'plans bounded autoscaling and pressure',
      () => {
        const service =
          new RuntimeProductionService();

        const snapshot =
          service.planCapacity({
            activeWorkers: 2,
            concurrencyPerWorker: 10,
            running: 18,
            queued: 22,
            targetUtilization: 0.8,
            maximumStep: 3,
          });

        expect(
          snapshot.desiredWorkers,
        ).toBe(5);

        expect(
          snapshot.scalingDirection,
        ).toBe('scale-up');

        expect(snapshot.pressure)
          .toBe('rejected');
      },
    );

    it(
      'opens circuits and emits healing actions',
      () => {
        const service =
          new RuntimeProductionService();

        service.recordFailure(2);
        service.recordFailure(2);

        const snapshot =
          service.planCapacity({
            activeWorkers: 1,
            concurrencyPerWorker: 10,
            running: 5,
            queued: 10,
            targetUtilization: 0.8,
            maximumStep: 2,
          });

        expect(
          snapshot.circuitState,
        ).toBe('open');

        expect(
          snapshot.healingActions,
        ).toContain(
          'isolate-dependency',
        );
      },
    );

    it(
      'enforces tenant permissions and quotas',
      () => {
        const service =
          new RuntimeProductionService();

        expect(
          service.authorize({
            tenantId: 'tenant-a',
            permissions: [
              'runtime.execute',
            ],
            requiredPermission:
              'runtime.execute',
            requestedResources: 4,
            maximumResources: 5,
          }),
        ).toBe(true);

        expect(
          service.authorize({
            tenantId: 'tenant-a',
            permissions: [],
            requiredPermission:
              'runtime.execute',
            requestedResources: 4,
            maximumResources: 5,
          }),
        ).toBe(false);
      },
    );
  },
);
