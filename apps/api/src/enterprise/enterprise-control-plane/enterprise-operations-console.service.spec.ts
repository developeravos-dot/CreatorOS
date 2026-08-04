import {
  EnterpriseControlPlaneService,
  EnterpriseOperationsConsoleService,
  EnterpriseResourceManagerService,
} from './services';

describe(
  'Enterprise operations console',
  () => {
    it(
      'aggregates control-plane state and alerts',
      () => {
        const controlPlane =
          new EnterpriseControlPlaneService();

        controlPlane.register({
          componentId:
            'runtime-one',
          displayName:
            'Runtime One',
          capacity: 100,
        });

        controlPlane.updateLoad(
          'runtime-one',
          60,
        );

        const operations =
          new EnterpriseOperationsConsoleService(
            controlPlane,
          );

        operations.raiseAlert({
          alertId: 'alert-one',
          severity: 'warning',
          title:
            'Runtime utilization elevated',
          componentId:
            'runtime-one',
        });

        expect(
          operations.snapshot(),
        ).toMatchObject({
          platformStatus:
            'operational',
          activeAlerts: 1,
          criticalAlerts: 0,
          utilization: 0.6,
        });

        operations.raiseAlert({
          alertId: 'alert-two',
          severity: 'critical',
          title:
            'Critical runtime fault',
        });

        expect(
          operations.snapshot()
            .platformStatus,
        ).toBe('critical');
      },
    );

    it(
      'allocates work to the least loaded eligible node',
      () => {
        const resources =
          new EnterpriseResourceManagerService();

        resources.registerNode({
          nodeId: 'node-a',
          cpuCapacity: 100,
          memoryCapacityMb: 1000,
        });

        resources.registerNode({
          nodeId: 'node-b',
          cpuCapacity: 100,
          memoryCapacityMb: 1000,
        });

        resources.allocate({
          requestId: 'request-one',
          workloadId: 'workload-one',
          cpuUnits: 60,
          memoryMb: 600,
          priority: 10,
          createdAt: new Date(),
        });

        const second =
          resources.allocate({
            requestId: 'request-two',
            workloadId: 'workload-two',
            cpuUnits: 20,
            memoryMb: 200,
            priority: 5,
            createdAt: new Date(),
          });

        expect(second.nodeId)
          .toBe('node-b');

        expect(
          resources.snapshot()
            .allocations,
        ).toHaveLength(2);
      },
    );

    it(
      'releases enterprise resource allocations',
      () => {
        const resources =
          new EnterpriseResourceManagerService();

        resources.registerNode({
          nodeId: 'node-one',
          cpuCapacity: 10,
          memoryCapacityMb: 100,
        });

        resources.allocate({
          requestId: 'request-one',
          workloadId: 'workload-one',
          cpuUnits: 5,
          memoryMb: 50,
          priority: 1,
          createdAt: new Date(),
        });

        expect(
          resources.release(
            'request-one',
          ),
        ).toBe(true);

        expect(
          resources.snapshot()
            .allocations,
        ).toHaveLength(0);
      },
    );
  },
);
