import { KnowledgeFabricService } from './knowledge/knowledge-fabric.service';
import { DataFabricService } from './data/data-fabric.service';
import { AiAgentRuntimeService } from './agents/ai-agent-runtime.service';
import { AiOrganizationOsService } from './organization/ai-organization-os.service';
import { IntelligenceCoreOrchestratorService } from './intelligence-core-orchestrator.service';

describe(
  'CreatorOS Intelligence Core Mega Pack B',
  () => {
    function setup() {
      const knowledge =
        new KnowledgeFabricService();
      const data =
        new DataFabricService();
      const runtime =
        new AiAgentRuntimeService(
          knowledge,
          data,
        );
      const organization =
        new AiOrganizationOsService(
          runtime,
        );
      const orchestrator =
        new IntelligenceCoreOrchestratorService(
          knowledge,
          data,
          runtime,
          organization,
        );

      return {
        knowledge,
        data,
        runtime,
        organization,
        orchestrator,
      };
    }

    it(
      'bootstraps all intelligence systems',
      () => {
        const { orchestrator } =
          setup();

        const status =
          orchestrator.bootstrap();

        expect(status.status).toBe(
          'operational',
        );
        expect(
          status.metrics.agents,
        ).toBe(4);
        expect(
          status.metrics.teams,
        ).toBe(2);
      },
    );

    it(
      'stores and versions knowledge',
      () => {
        const {
          orchestrator,
          knowledge,
        } = setup();

        orchestrator.bootstrap();

        knowledge.upsert({
          key: 'creatoros-living-vision',
          type: 'idea',
          title:
            'CreatorOS Living Vision',
          content:
            'Updated living strategic intelligence.',
          source: 'test',
        });

        expect(
          knowledge.get(
            'creatoros-living-vision',
          ).version,
        ).toBe(2);
      },
    );

    it(
      'registers governed data assets',
      () => {
        const {
          orchestrator,
          data,
        } = setup();

        orchestrator.bootstrap();

        expect(
          data.list().length,
        ).toBeGreaterThanOrEqual(2);
      },
    );

    it(
      'activates all AI agents',
      () => {
        const {
          orchestrator,
          runtime,
        } = setup();

        orchestrator.bootstrap();

        expect(
          runtime
            .listAgents()
            .every(
              (agent) =>
                agent.status === 'active',
            ),
        ).toBe(true);
      },
    );

    it(
      'creates AI organization teams',
      () => {
        const {
          orchestrator,
          organization,
        } = setup();

        orchestrator.bootstrap();

        expect(
          organization.listTeams(),
        ).toHaveLength(2);
      },
    );

    it(
      'runs an AI council mission',
      async () => {
        const { orchestrator } =
          setup();

        orchestrator.bootstrap();

        const mission =
          await orchestrator.runCouncilMission({
            objective:
              'Evaluate platform expansion readiness.',
          });

        expect(
          mission.humanApprovalRequired,
        ).toBe(true);
        expect(
          mission.tasks,
        ).toHaveLength(3);
        expect(
          mission.tasks.every(
            (task) =>
              task.status === 'completed',
          ),
        ).toBe(true);
      },
    );

    it(
      'reports all four intelligence systems',
      () => {
        const { orchestrator } =
          setup();

        orchestrator.bootstrap();

        const status =
          orchestrator.status();

        expect(
          status.systems.knowledgeFabric,
        ).toBe(true);
        expect(
          status.systems.aiOrganizationOs,
        ).toBe(true);
        expect(
          status.systems.aiAgentRuntime,
        ).toBe(true);
        expect(
          status.systems.dataFabric,
        ).toBe(true);
      },
    );
  },
);