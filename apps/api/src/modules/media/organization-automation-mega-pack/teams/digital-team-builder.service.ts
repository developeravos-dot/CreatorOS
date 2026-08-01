import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  DigitalTeam,
  OrganizationBrief,
  SpecialistAgent,
} from '../organization-automation.types';

@Injectable()
export class DigitalTeamBuilderService {
  build(
    brief: OrganizationBrief,
    agents: SpecialistAgent[],
  ): DigitalTeam[] {
    const departmentNames = [
      ...new Set(
        agents.map((agent) => agent.department),
      ),
    ];

    return departmentNames.map((department) => {
      const members = agents.filter(
        (agent) => agent.department === department,
      );
      const coordinator =
        members.find(
          (agent) => agent.authorityLevel === 'supervisory',
        ) ??
        members[0] ??
        agents[0];

      if (!coordinator) {
        throw new Error('At least one agent is required to build teams.');
      }

      return {
        id: randomUUID(),
        name: `${department} Digital Team`,
        department,
        mission: `${brief.mission} — ${department}`,
        agentIds: members.map((agent) => agent.id),
        coordinatorAgentId: coordinator.id,
        escalationRules: [
          'escalate-blockers-after-one-failed-attempt',
          'escalate-high-risk-actions-before-execution',
          'escalate-strategic-decisions-to-human-authority',
        ],
      };
    });
  }
}