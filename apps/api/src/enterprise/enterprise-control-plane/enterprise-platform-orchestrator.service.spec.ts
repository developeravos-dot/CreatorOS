import {
  EnterpriseAiOrganizationService,
  EnterpriseAuditLedgerService,
  EnterpriseControlPlaneService,
  EnterpriseEventBusService,
  EnterpriseGlobalSchedulerService,
  EnterpriseOperationsConsoleService,
  EnterprisePlatformOrchestratorService,
} from './services';

describe(
  'EnterprisePlatformOrchestratorService',
  () => {
    const createSystem = () => {
      const controlPlane =
        new EnterpriseControlPlaneService();

      const operations =
        new EnterpriseOperationsConsoleService(
          controlPlane,
        );

      const organization =
        new EnterpriseAiOrganizationService();

      const scheduler =
        new EnterpriseGlobalSchedulerService();

      const events =
        new EnterpriseEventBusService();

      const audit =
        new EnterpriseAuditLedgerService();

      const orchestrator =
        new EnterprisePlatformOrchestratorService(
          controlPlane,
          operations,
          organization,
          scheduler,
          events,
          audit,
        );

      return {
        controlPlane,
        operations,
        organization,
        scheduler,
        events,
        audit,
        orchestrator,
      };
    };

    it(
      'aggregates the enterprise platform state',
      () => {
        const system = createSystem();

        system.controlPlane.register({
          componentId: 'runtime-one',
          displayName: 'Runtime One',
          capacity: 100,
        });

        system.controlPlane.updateLoad(
          'runtime-one',
          40,
        );

        const snapshot =
          system.orchestrator.snapshot();

        expect(
          snapshot.controlPlane,
        ).toMatchObject({
          totalComponents: 1,
          activeWorkloads: 40,
          totalCapacity: 100,
          utilization: 0.4,
        });

        expect(
          snapshot.operations
            .platformStatus,
        ).toBe('operational');

        expect(
          snapshot.scheduledTasks,
        ).toEqual([]);

        expect(snapshot.events)
          .toEqual([]);

        expect(snapshot.auditRecords)
          .toEqual([]);
      },
    );

    it(
      'executes a scheduled task with event and audit records',
      () => {
        const system = createSystem();

        system.scheduler.schedule({
          taskId: 'task-one',
          type: 'rebalance',
          priority: 100,
          dueAt: new Date(
            '2026-08-04T12:00:00.000Z',
          ),
        });

        const result =
          system.orchestrator.executeScheduledTask({
            taskId: 'task-one',
            actor: 'operations-admin',
            now: new Date(
              '2026-08-04T12:01:00.000Z',
            ),
          });

        expect(result.task.status)
          .toBe('running');

        expect(result.event)
          .toMatchObject({
            eventId:
              'event-task-one-started',
            type:
              'enterprise.task.started',
            source:
              'enterprise-platform-orchestrator',
          });

        expect(result.audit)
          .toMatchObject({
            auditId:
              'audit-task-one-started',
            actor:
              'operations-admin',
            action:
              'enterprise.task.start',
            resource:
              'task-one',
          });

        expect(
          system.events.query(),
        ).toHaveLength(1);

        expect(
          system.audit.query(),
        ).toHaveLength(1);
      },
    );

    it(
      'orders due tasks by priority',
      () => {
        const system = createSystem();

        const dueAt = new Date(
          '2026-08-04T12:00:00.000Z',
        );

        system.scheduler.schedule({
          taskId: 'low',
          type: 'low-priority',
          priority: 1,
          dueAt,
        });

        system.scheduler.schedule({
          taskId: 'high',
          type: 'high-priority',
          priority: 10,
          dueAt,
        });

        expect(
          system.scheduler
            .due(dueAt)
            .map(
              (task) => task.taskId,
            ),
        ).toEqual([
          'high',
          'low',
        ]);
      },
    );

    it(
      'rejects duplicate enterprise events and audit records',
      () => {
        const system = createSystem();

        system.events.publish({
          eventId: 'event-one',
          type: 'runtime.started',
          source: 'runtime',
        });

        expect(
          () =>
            system.events.publish({
              eventId: 'event-one',
              type: 'runtime.started',
              source: 'runtime',
            }),
        ).toThrow(
          'unique event id',
        );

        system.audit.record({
          auditId: 'audit-one',
          actor: 'admin',
          action: 'runtime.start',
          resource: 'runtime-one',
        });

        expect(
          () =>
            system.audit.record({
              auditId: 'audit-one',
              actor: 'admin',
              action: 'runtime.start',
              resource: 'runtime-one',
            }),
        ).toThrow(
          'unique audit record',
        );
      },
    );
  },
);