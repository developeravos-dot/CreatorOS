import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AiTeam } from '../intelligence-core.types';
import { AiAgentRuntimeService } from '../agents/ai-agent-runtime.service';

@Injectable()
export class AiOrganizationOsService {
  private readonly teams = new Map<
    string,
    AiTeam
  >();

  constructor(
    private readonly runtime:
      AiAgentRuntimeService,
  ) {}

  createTeam(input: {
    key: string;
    name: string;
    mission: string;
    agentKeys: string[];
  }) {
    const existing = this.teams.get(input.key);

    if (existing) {
      return existing;
    }

    for (const agentKey of input.agentKeys) {
      this.runtime.getAgent(agentKey);
    }

    const team: AiTeam = {
      id: randomUUID(),
      ...input,
      humanFinalAuthority: true,
      createdAt: new Date().toISOString(),
    };

    this.teams.set(team.key, team);
    return team;
  }

  async assignMission(input: {
    teamKey: string;
    objective: string;
    context?: Record<string, unknown>;
  }) {
    const team = this.getTeam(input.teamKey);

    const results = [];

    for (const agentKey of team.agentKeys) {
      results.push(
        await this.runtime.execute({
          agentKey,
          objective: input.objective,
          input: input.context ?? {},
        }),
      );
    }

    return {
      team: team.key,
      mission: input.objective,
      humanApprovalRequired: true,
      tasks: results,
    };
  }

  getTeam(key: string) {
    const team = this.teams.get(key);

    if (!team) {
      throw new Error(
        `AI team not found: ${key}`,
      );
    }

    return team;
  }

  listTeams() {
    return [...this.teams.values()];
  }
}