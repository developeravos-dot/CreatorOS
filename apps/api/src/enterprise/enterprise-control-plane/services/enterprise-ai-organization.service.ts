import {
  Injectable,
} from '@nestjs/common';

export interface EnterpriseAiAgent {
  readonly agentId: string;
  readonly displayName: string;
  readonly role: string;
  readonly capabilities:
    readonly string[];
  readonly state:
    | 'available'
    | 'busy'
    | 'offline';
  readonly activeAssignments: number;
  readonly maximumAssignments: number;
  readonly updatedAt: Date;
}

export interface EnterpriseAiTeam {
  readonly teamId: string;
  readonly displayName: string;
  readonly agentIds:
    readonly string[];
  readonly mission: string;
  readonly createdAt: Date;
}

export interface EnterpriseAiAssignment {
  readonly assignmentId: string;
  readonly teamId: string;
  readonly agentId: string;
  readonly objective: string;
  readonly requiredCapabilities:
    readonly string[];
  readonly priority: number;
  readonly status:
    | 'assigned'
    | 'completed'
    | 'failed';
  readonly createdAt: Date;
  readonly completedAt: Date | null;
}

@Injectable()
export class EnterpriseAiOrganizationService {
  private readonly agents =
    new Map<string, EnterpriseAiAgent>();

  private readonly teams =
    new Map<string, EnterpriseAiTeam>();

  private readonly assignments =
    new Map<
      string,
      EnterpriseAiAssignment
    >();

  registerAgent(input: {
    readonly agentId: string;
    readonly displayName: string;
    readonly role: string;
    readonly capabilities:
      readonly string[];
    readonly maximumAssignments: number;
    readonly now?: Date;
  }): EnterpriseAiAgent {
    const agentId =
      input.agentId.trim();

    const displayName =
      input.displayName.trim();

    const role =
      input.role.trim();

    const capabilities =
      [...new Set(
        input.capabilities
          .map((item) => item.trim())
          .filter(Boolean),
      )];

    if (
      !agentId ||
      !displayName ||
      !role ||
      capabilities.length === 0 ||
      !Number.isInteger(
        input.maximumAssignments,
      ) ||
      input.maximumAssignments < 1 ||
      this.agents.has(agentId)
    ) {
      throw new Error(
        'Valid unique AI agent registration is required.',
      );
    }

    const agent: EnterpriseAiAgent = {
      agentId,
      displayName,
      role,
      capabilities,
      state: 'available',
      activeAssignments: 0,
      maximumAssignments:
        input.maximumAssignments,
      updatedAt: new Date(
        input.now ?? new Date(),
      ),
    };

    this.agents.set(agentId, agent);
    return this.cloneAgent(agent);
  }

  createTeam(input: {
    readonly teamId: string;
    readonly displayName: string;
    readonly agentIds:
      readonly string[];
    readonly mission: string;
    readonly now?: Date;
  }): EnterpriseAiTeam {
    const teamId =
      input.teamId.trim();

    const displayName =
      input.displayName.trim();

    const mission =
      input.mission.trim();

    const agentIds =
      [...new Set(
        input.agentIds
          .map((item) => item.trim())
          .filter(Boolean),
      )];

    if (
      !teamId ||
      !displayName ||
      !mission ||
      agentIds.length === 0 ||
      this.teams.has(teamId)
    ) {
      throw new Error(
        'Valid unique AI team definition is required.',
      );
    }

    for (const agentId of agentIds) {
      if (!this.agents.has(agentId)) {
        throw new Error(
          `AI agent ${agentId} was not found.`,
        );
      }
    }

    const team: EnterpriseAiTeam = {
      teamId,
      displayName,
      agentIds,
      mission,
      createdAt: new Date(
        input.now ?? new Date(),
      ),
    };

    this.teams.set(teamId, team);
    return this.cloneTeam(team);
  }

  assign(input: {
    readonly assignmentId: string;
    readonly teamId: string;
    readonly objective: string;
    readonly requiredCapabilities:
      readonly string[];
    readonly priority: number;
    readonly now?: Date;
  }): EnterpriseAiAssignment {
    const assignmentId =
      input.assignmentId.trim();

    const objective =
      input.objective.trim();

    const requiredCapabilities =
      [...new Set(
        input.requiredCapabilities
          .map((item) => item.trim())
          .filter(Boolean),
      )];

    const team =
      this.teams.get(
        input.teamId.trim(),
      );

    if (
      !assignmentId ||
      !objective ||
      requiredCapabilities.length === 0 ||
      !Number.isInteger(
        input.priority,
      ) ||
      this.assignments.has(
        assignmentId,
      ) ||
      !team
    ) {
      throw new Error(
        'Valid unique AI assignment is required.',
      );
    }

    const eligible =
      team.agentIds
        .map((agentId) =>
          this.agents.get(agentId),
        )
        .filter(
          (
            agent,
          ): agent is EnterpriseAiAgent =>
            agent !== undefined &&
            agent.state !== 'offline' &&
            agent.activeAssignments <
              agent.maximumAssignments &&
            requiredCapabilities.every(
              (capability) =>
                agent.capabilities.includes(
                  capability,
                ),
            ),
        )
        .sort(
          (left, right) =>
            left.activeAssignments -
              right.activeAssignments ||
            left.agentId.localeCompare(
              right.agentId,
            ),
        );

    const selected =
      eligible[0];

    if (!selected) {
      throw new Error(
        'No eligible AI agent can satisfy the assignment.',
      );
    }

    const updatedAgent:
      EnterpriseAiAgent = {
        ...selected,
        state:
          selected.activeAssignments + 1 >=
          selected.maximumAssignments
            ? 'busy'
            : 'available',
        activeAssignments:
          selected.activeAssignments + 1,
        updatedAt: new Date(
          input.now ?? new Date(),
        ),
      };

    this.agents.set(
      selected.agentId,
      updatedAgent,
    );

    const assignment:
      EnterpriseAiAssignment = {
        assignmentId,
        teamId: team.teamId,
        agentId:
          selected.agentId,
        objective,
        requiredCapabilities,
        priority: input.priority,
        status: 'assigned',
        createdAt: new Date(
          input.now ?? new Date(),
        ),
        completedAt: null,
      };

    this.assignments.set(
      assignmentId,
      assignment,
    );

    return this.cloneAssignment(
      assignment,
    );
  }

  complete(
    assignmentId: string,
    success = true,
    now = new Date(),
  ): EnterpriseAiAssignment {
    const current =
      this.assignments.get(
        assignmentId.trim(),
      );

    if (!current) {
      throw new Error(
        `AI assignment ${assignmentId} was not found.`,
      );
    }

    if (
      current.status !== 'assigned'
    ) {
      return this.cloneAssignment(
        current,
      );
    }

    const agent =
      this.agents.get(
        current.agentId,
      );

    if (agent) {
      const activeAssignments =
        Math.max(
          0,
          agent.activeAssignments - 1,
        );

      this.agents.set(
        agent.agentId,
        {
          ...agent,
          activeAssignments,
          state:
            agent.state === 'offline'
              ? 'offline'
              : activeAssignments >=
                    agent.maximumAssignments
                ? 'busy'
                : 'available',
          updatedAt: new Date(now),
        },
      );
    }

    const completed:
      EnterpriseAiAssignment = {
        ...current,
        status: success
          ? 'completed'
          : 'failed',
        completedAt: new Date(now),
      };

    this.assignments.set(
      assignmentId,
      completed,
    );

    return this.cloneAssignment(
      completed,
    );
  }

  snapshot() {
    return {
      agents:
        [...this.agents.values()]
          .sort(
            (left, right) =>
              left.agentId.localeCompare(
                right.agentId,
              ),
          )
          .map((agent) =>
            this.cloneAgent(agent),
          ),
      teams:
        [...this.teams.values()]
          .sort(
            (left, right) =>
              left.teamId.localeCompare(
                right.teamId,
              ),
          )
          .map((team) =>
            this.cloneTeam(team),
          ),
      assignments:
        [...this.assignments.values()]
          .sort(
            (left, right) =>
              left.createdAt.getTime() -
              right.createdAt.getTime(),
          )
          .map((assignment) =>
            this.cloneAssignment(
              assignment,
            ),
          ),
      generatedAt: new Date(),
    };
  }

  private cloneAgent(
    agent: EnterpriseAiAgent,
  ): EnterpriseAiAgent {
    return {
      ...agent,
      capabilities: [
        ...agent.capabilities,
      ],
      updatedAt: new Date(
        agent.updatedAt,
      ),
    };
  }

  private cloneTeam(
    team: EnterpriseAiTeam,
  ): EnterpriseAiTeam {
    return {
      ...team,
      agentIds: [
        ...team.agentIds,
      ],
      createdAt: new Date(
        team.createdAt,
      ),
    };
  }

  private cloneAssignment(
    assignment:
      EnterpriseAiAssignment,
  ): EnterpriseAiAssignment {
    return {
      ...assignment,
      requiredCapabilities: [
        ...assignment
          .requiredCapabilities,
      ],
      createdAt: new Date(
        assignment.createdAt,
      ),
      completedAt:
        assignment.completedAt
          ? new Date(
              assignment.completedAt,
            )
          : null,
    };
  }
}
