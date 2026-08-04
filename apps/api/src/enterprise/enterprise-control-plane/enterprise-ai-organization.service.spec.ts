import {
  EnterpriseAiOrganizationService,
} from './services';

describe(
  'EnterpriseAiOrganizationService',
  () => {
    it(
      'builds teams and selects the least loaded eligible agent',
      () => {
        const service =
          new EnterpriseAiOrganizationService();

        service.registerAgent({
          agentId: 'agent-a',
          displayName: 'Agent A',
          role: 'planner',
          capabilities: [
            'plan',
            'analyze',
          ],
          maximumAssignments: 2,
        });

        service.registerAgent({
          agentId: 'agent-b',
          displayName: 'Agent B',
          role: 'planner',
          capabilities: [
            'plan',
            'analyze',
          ],
          maximumAssignments: 2,
        });

        service.createTeam({
          teamId: 'team-one',
          displayName:
            'Planning Team',
          agentIds: [
            'agent-a',
            'agent-b',
          ],
          mission:
            'Plan enterprise work.',
        });

        const first =
          service.assign({
            assignmentId:
              'assignment-one',
            teamId: 'team-one',
            objective:
              'Create plan',
            requiredCapabilities: [
              'plan',
            ],
            priority: 10,
          });

        const second =
          service.assign({
            assignmentId:
              'assignment-two',
            teamId: 'team-one',
            objective:
              'Analyze plan',
            requiredCapabilities: [
              'analyze',
            ],
            priority: 5,
          });

        expect(first.agentId)
          .toBe('agent-a');

        expect(second.agentId)
          .toBe('agent-b');
      },
    );

    it(
      'releases agent capacity when assignments complete',
      () => {
        const service =
          new EnterpriseAiOrganizationService();

        service.registerAgent({
          agentId: 'agent-one',
          displayName:
            'Agent One',
          role: 'executor',
          capabilities: [
            'execute',
          ],
          maximumAssignments: 1,
        });

        service.createTeam({
          teamId: 'team-one',
          displayName:
            'Execution Team',
          agentIds: [
            'agent-one',
          ],
          mission:
            'Execute enterprise work.',
        });

        service.assign({
          assignmentId:
            'assignment-one',
          teamId: 'team-one',
          objective:
            'Execute task',
          requiredCapabilities: [
            'execute',
          ],
          priority: 1,
        });

        expect(
          service.snapshot()
            .agents[0]?.state,
        ).toBe('busy');

        service.complete(
          'assignment-one',
        );

        expect(
          service.snapshot()
            .agents[0]?.state,
        ).toBe('available');
      },
    );

    it(
      'rejects assignments without eligible agents',
      () => {
        const service =
          new EnterpriseAiOrganizationService();

        service.registerAgent({
          agentId: 'agent-one',
          displayName:
            'Agent One',
          role: 'writer',
          capabilities: [
            'write',
          ],
          maximumAssignments: 1,
        });

        service.createTeam({
          teamId: 'team-one',
          displayName:
            'Content Team',
          agentIds: [
            'agent-one',
          ],
          mission:
            'Create content.',
        });

        expect(
          () =>
            service.assign({
              assignmentId:
                'assignment-one',
              teamId: 'team-one',
              objective:
                'Deploy system',
              requiredCapabilities: [
                'deploy',
              ],
              priority: 1,
            }),
        ).toThrow(
          'No eligible AI agent',
        );
      },
    );
  },
);
