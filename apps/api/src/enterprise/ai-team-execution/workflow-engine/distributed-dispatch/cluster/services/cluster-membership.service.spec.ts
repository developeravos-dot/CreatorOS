import {
  ClusterMembershipService,
} from './cluster-membership.service';

describe(
  'ClusterMembershipService',
  () => {
    function registerNode(
      service:
        ClusterMembershipService,
      nodeId: string,
      now =
        new Date(
          '2026-08-04T08:00:00.000Z',
        ),
    ) {
      return service.register({
        nodeId,
        instanceId:
          `${nodeId}-instance`,
        host:
          `${nodeId}.internal`,
        processId: 100,
        capabilities: {
          queues: [
            'workflow-step',
          ],
          jobTypes: [
            'workflow.execute',
          ],
          maximumConcurrency: 4,
          labels: {
            region: 'primary',
          },
        },
        now,
      });
    }

    it(
      'registers and discovers nodes',
      () => {
        const service =
          new ClusterMembershipService();

        registerNode(
          service,
          'node-a',
        );

        registerNode(
          service,
          'node-b',
        );

        expect(
          service.discover().map(
            (node) =>
              node.nodeId,
          ),
        ).toEqual([
          'node-a',
          'node-b',
        ]);
      },
    );

    it(
      'rejects instance conflicts',
      () => {
        const service =
          new ClusterMembershipService();

        registerNode(
          service,
          'node-a',
        );

        expect(() =>
          service.register({
            nodeId: 'node-a',
            instanceId:
              'different-instance',
            host:
              'node-a.internal',
            processId: 101,
            capabilities: {
              queues: [],
              jobTypes: [],
              maximumConcurrency: 1,
              labels: {},
            },
          }),
        ).toThrow(
          'already registered',
        );
      },
    );

    it(
      'updates heartbeat metrics',
      () => {
        const service =
          new ClusterMembershipService();

        registerNode(
          service,
          'node-a',
        );

        const updated =
          service.heartbeat({
            nodeId: 'node-a',
            instanceId:
              'node-a-instance',
            activeJobs: 2,
            completedJobs: 10,
            failedJobs: 1,
            memoryUsageBytes: 4096,
            cpuUsagePercent: 25,
            now:
              new Date(
                '2026-08-04T08:00:10.000Z',
              ),
          });

        expect(updated.activeJobs)
          .toBe(2);

        expect(updated.completedJobs)
          .toBe(10);

        expect(updated.state)
          .toBe('active');
      },
    );

    it(
      'detects nodes with expired heartbeats',
      () => {
        const service =
          new ClusterMembershipService();

        registerNode(
          service,
          'node-a',
          new Date(
            '2026-08-04T08:00:00.000Z',
          ),
        );

        const offline =
          service.detectOfflineNodes(
            60_000,
            new Date(
              '2026-08-04T08:01:01.000Z',
            ),
          );

        expect(offline)
          .toHaveLength(1);

        expect(
          offline[0]?.state,
        ).toBe('offline');
      },
    );

    it(
      'supports degraded draining and removed states',
      () => {
        const service =
          new ClusterMembershipService();

        registerNode(
          service,
          'node-a',
        );

        expect(
          service.markDegraded(
            'node-a',
          ).state,
        ).toBe('degraded');

        expect(
          service.markDraining(
            'node-a',
          ).state,
        ).toBe('draining');

        expect(
          service.remove(
            'node-a',
          ).state,
        ).toBe('removed');

        expect(
          service.discover(),
        ).toHaveLength(0);
      },
    );

    it(
      'returns immutable node snapshots',
      () => {
        const service =
          new ClusterMembershipService();

        registerNode(
          service,
          'node-a',
        );

        const first =
          service.get('node-a');

        const second =
          service.get('node-a');

        expect(first)
          .toEqual(second);

        expect(first)
          .not.toBe(second);

        expect(
          first?.capabilities,
        ).not.toBe(
          second?.capabilities,
        );
      },
    );

    it(
      'records membership metrics',
      () => {
        const service =
          new ClusterMembershipService();

        registerNode(
          service,
          'node-a',
        );

        service.heartbeat({
          nodeId: 'node-a',
          instanceId:
            'node-a-instance',
          activeJobs: 0,
          completedJobs: 1,
          failedJobs: 0,
        });

        const metrics =
          service.getMetrics();

        expect(
          metrics.registeredNodes,
        ).toBe(1);

        expect(
          metrics.activeNodes,
        ).toBe(1);

        expect(
          metrics.heartbeatEvents,
        ).toBe(1);
      },
    );
  },
);