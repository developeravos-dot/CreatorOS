import {
  EnterpriseControlPlaneService,
} from './services';

describe(
  'EnterpriseControlPlaneService',
  () => {
    it(
      'registers components and calculates global status',
      () => {
        const service =
          new EnterpriseControlPlaneService();

        service.register({
          componentId:
            'runtime-primary',
          displayName:
            'Primary Runtime',
          capacity: 100,
        });

        service.updateLoad(
          'runtime-primary',
          40,
        );

        expect(
          service.snapshot(),
        ).toMatchObject({
          status: 'operational',
          totalComponents: 1,
          onlineComponents: 1,
          activeWorkloads: 40,
          totalCapacity: 100,
          utilization: 0.4,
        });
      },
    );

    it(
      'executes maintenance and drain commands',
      () => {
        const service =
          new EnterpriseControlPlaneService();

        service.register({
          componentId:
            'runtime-secondary',
          displayName:
            'Secondary Runtime',
          capacity: 50,
        });

        service.updateLoad(
          'runtime-secondary',
          20,
        );

        const drained =
          service.command({
            commandId:
              'command-one',
            type: 'drain',
            componentId:
              'runtime-secondary',
            requestedBy:
              'operations-admin',
          });

        expect(drained.state)
          .toBe('maintenance');

        expect(
          drained.activeWorkloads,
        ).toBe(0);

        expect(
          service.listCommands(),
        ).toHaveLength(1);
      },
    );

    it(
      'prevents duplicate components and commands',
      () => {
        const service =
          new EnterpriseControlPlaneService();

        service.register({
          componentId:
            'runtime-one',
          displayName:
            'Runtime One',
          capacity: 10,
        });

        expect(
          () =>
            service.register({
              componentId:
                'runtime-one',
              displayName:
                'Runtime One',
              capacity: 10,
            }),
        ).toThrow(
          'already exists',
        );

        service.command({
          commandId: 'duplicate',
          type: 'rebalance',
          componentId:
            'runtime-one',
          requestedBy: 'admin',
        });

        expect(
          () =>
            service.command({
              commandId:
                'duplicate',
              type: 'resume',
              componentId:
                'runtime-one',
              requestedBy:
                'admin',
            }),
        ).toThrow(
          'unique command id',
        );
      },
    );
  },
);
