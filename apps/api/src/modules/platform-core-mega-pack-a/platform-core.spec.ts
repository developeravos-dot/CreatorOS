import { CapabilityFabricService } from './capabilities/capability-fabric.service';
import { PlatformEventBusService } from './events/platform-event-bus.service';
import { PlatformIntegrationMp2Service } from './integration/platform-integration-mp2.service';
import { PlatformIntegrationMp3Service } from './integration/platform-integration-mp3.service';
import { PlatformCoreOrchestratorService } from './platform-core-orchestrator.service';
import { PlatformWorkflowEngineService } from './workflows/platform-workflow-engine.service';

describe(
  'CreatorOS Platform Core Mega Pack A',
  () => {
    function setup() {
      const fabric =
        new CapabilityFabricService();
      const eventBus =
        new PlatformEventBusService();
      const workflows =
        new PlatformWorkflowEngineService(
          fabric,
          eventBus,
        );
      const mp2 =
        new PlatformIntegrationMp2Service(
          fabric,
        );
      const mp3 =
        new PlatformIntegrationMp3Service(
          fabric,
          eventBus,
          workflows,
        );
      const orchestrator =
        new PlatformCoreOrchestratorService(
          mp2,
          mp3,
          workflows,
        );

      return {
        fabric,
        eventBus,
        workflows,
        orchestrator,
      };
    }

    it(
      'bootstraps all platform capabilities',
      () => {
        const { orchestrator } =
          setup();

        const result =
          orchestrator.bootstrap();

        expect(
          result.capabilities,
        ).toHaveLength(5);

        expect(
          result.status.status,
        ).toBe('operational');
      },
    );

    it(
      'builds the platform dependency graph',
      () => {
        const {
          orchestrator,
          fabric,
        } = setup();

        orchestrator.bootstrap();

        const graph = fabric.graph();

        expect(graph.nodes).toHaveLength(
          5,
        );
        expect(graph.edges).toHaveLength(
          4,
        );
      },
    );

    it(
      'publishes and stores platform events',
      async () => {
        const {
          orchestrator,
          eventBus,
        } = setup();

        orchestrator.bootstrap();

        await eventBus.publish(
          'platform.test',
          'platform',
          { ok: true },
        );

        expect(
          eventBus.history(),
        ).toHaveLength(1);
      },
    );

    it(
      'creates and prepares workflows',
      () => {
        const { orchestrator } =
          setup();

        orchestrator.bootstrap();

        const workflow =
          orchestrator.createWorkflow({
            name:
              'Knowledge Enrichment',
            steps: [
              {
                name:
                  'Store Knowledge',
                capability:
                  'knowledge',
                command:
                  'store-knowledge',
                dependsOn: [],
              },
            ],
          });

        const ready =
          orchestrator.prepareWorkflow(
            workflow.id,
          );

        expect(ready.status).toBe(
          'ready',
        );
      },
    );

    it(
      'executes cross-capability workflows',
      async () => {
        const { orchestrator } =
          setup();

        orchestrator.bootstrap();

        const workflow =
          orchestrator.createWorkflow({
            name:
              'Content Production',
            steps: [
              {
                name:
                  'Generate Content',
                capability: 'media',
                command:
                  'generate-content',
                dependsOn: [],
              },
            ],
          });

        orchestrator.prepareWorkflow(
          workflow.id,
        );

        const executed =
          await orchestrator.executeWorkflow(
            workflow.id,
          );

        expect(executed.status).toBe(
          'completed',
        );
        expect(
          executed.steps[0]?.status,
        ).toBe('completed');
      },
    );

    it(
      'reports all five core systems',
      () => {
        const { orchestrator } =
          setup();

        orchestrator.bootstrap();

        const status =
          orchestrator.status();

        expect(
          status.systems
            .platformIntegrationMp2,
        ).toBe(true);
        expect(
          status.systems
            .platformIntegrationMp3,
        ).toBe(true);
        expect(
          status.systems.capabilityFabric,
        ).toBe(true);
        expect(
          status.systems.eventBus,
        ).toBe(true);
        expect(
          status.systems.workflowEngine,
        ).toBe(true);
      },
    );
  },
);