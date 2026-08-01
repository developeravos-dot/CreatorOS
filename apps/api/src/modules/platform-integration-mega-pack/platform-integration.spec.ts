import { PlatformCommandRouterService } from './commands/platform-command-router.service';
import { PlatformDashboardService } from './dashboard/platform-dashboard.service';
import { PlatformEventLedgerService } from './events/platform-event-ledger.service';
import { PlatformIntegrationOrchestratorService } from './platform-integration-orchestrator.service';
import { PlatformCapabilityRegistryService } from './registry/platform-capability-registry.service';

describe(
  'CreatorOS Platform Integration Mega Pack',
  () => {
    function service() {
      return new PlatformIntegrationOrchestratorService(
        new PlatformCapabilityRegistryService(),
        new PlatformCommandRouterService(),
        new PlatformEventLedgerService(),
        new PlatformDashboardService(),
      );
    }

    it(
      'bootstraps the CreatorOS platform',
      () => {
        const orchestrator =
          service();
        const platform =
          orchestrator.bootstrap();

        expect(platform.name).toBe(
          'CreatorOS',
        );
        expect(
          platform.capabilities,
        ).toHaveLength(6);
        expect(platform.status).toBe(
          'awaiting-human-approval',
        );
      },
    );

    it(
      'requires human approval before activation',
      () => {
        const orchestrator =
          service();
        const platform =
          orchestrator.bootstrap();

        expect(() =>
          orchestrator.activate(
            'AI Operator',
          ),
        ).toThrow();

        orchestrator.approve(
          'Khalifa',
        );
        orchestrator.activate(
          'Khalifa',
        );

        expect(platform.status).toBe(
          'active',
        );
      },
    );

    it(
      'registers new capabilities',
      () => {
        const orchestrator =
          service();
        orchestrator.bootstrap();

        const capability =
          orchestrator.registerCapability(
            {
              key: 'commerce',
              name:
                'CreatorOS Commerce',
              domain: 'Commerce',
              version: '1.0.0',
              apiRoot: '/commerce',
              dependencies: [],
              enabled: true,
              metadata: {},
            },
            'Platform Architect',
          );

        expect(capability.key).toBe(
          'commerce',
        );
        expect(
          orchestrator
            .getPlatform()
            .capabilities,
        ).toHaveLength(7);
      },
    );

    it(
      'routes low-risk commands',
      () => {
        const orchestrator =
          service();
        orchestrator.bootstrap();
        orchestrator.approve(
          'Khalifa',
        );
        orchestrator.activate(
          'Khalifa',
        );

        const command =
          orchestrator.createCommand(
            'refresh-dashboard',
            'command-center',
            {},
            'low',
            'Operator',
          );

        orchestrator.executeCommand(
          command.id,
          'Operator',
        );

        expect(command.status).toBe(
          'completed',
        );
        expect(command.result?.routed).toBe(
          true,
        );
      },
    );

    it(
      'protects high-risk commands',
      () => {
        const orchestrator =
          service();
        orchestrator.bootstrap();
        orchestrator.approve(
          'Khalifa',
        );
        orchestrator.activate(
          'Khalifa',
        );

        const command =
          orchestrator.createCommand(
            'publish-global-release',
            'media',
            {},
            'high',
            'Media Agent',
          );

        expect(command.status).toBe(
          'awaiting-human-approval',
        );

        expect(() =>
          orchestrator.executeCommand(
            command.id,
            'Media Agent',
          ),
        ).toThrow();

        orchestrator.approveCommand(
          command.id,
          'Khalifa',
        );
        orchestrator.executeCommand(
          command.id,
          'Khalifa',
        );

        expect(command.status).toBe(
          'completed',
        );
      },
    );

    it(
      'builds unified platform dashboard',
      () => {
        const orchestrator =
          service();
        orchestrator.bootstrap();

        const result =
          orchestrator.dashboard();

        expect(
          result.dashboard.totals
            .capabilities,
        ).toBe(6);
        expect(
          result.capabilities.systems,
        ).toHaveLength(6);
      },
    );
  },
);