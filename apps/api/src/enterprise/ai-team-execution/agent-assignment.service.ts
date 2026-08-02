import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  ExecutionStatus,
} from "../../generated/prisma/client";

import type {
  AssignExecutionJobInput,
  ExecutionJobAssignment,
} from "./agent-assignment.contracts";

import {
  AiTeamExecutionRepository,
} from "./ai-team-execution.repository";

import {
  RuntimeDispatcherService,
} from "./runtime-dispatcher.service";

@Injectable()
export class AgentAssignmentService {
  constructor(
    private readonly repository:
      AiTeamExecutionRepository,

    private readonly dispatcher:
      RuntimeDispatcherService,
  ) {}

  async assignJob(
    jobId: string,
    input: AssignExecutionJobInput = {},
  ): Promise<ExecutionJobAssignment> {
    const job =
      await this.repository.findJobById(jobId);

    if (!job) {
      throw new NotFoundException(
        `Execution job was not found: ${jobId}`,
      );
    }

    if (
      job.status === ExecutionStatus.COMPLETED ||
      job.status === ExecutionStatus.CANCELLED
    ) {
      throw new ConflictException(
        `Execution job cannot be assigned from status: ${job.status}`,
      );
    }

    const capability =
      input.capability?.trim() ||
      job.capability?.trim();

    if (!capability) {
      throw new BadRequestException(
        "A capability is required before assigning the execution job.",
      );
    }

    if (
      input.humanOverride &&
      input.preferredProviderId
    ) {
      const provider =
        await this.dispatcher.listProviders(
          capability,
        );

      const selected =
        provider.find(
          (item) =>
            item.id ===
            input.preferredProviderId,
        );

      if (!selected) {
        throw new NotFoundException({
          message:
            "The manually selected Runtime provider was not found.",
          providerId:
            input.preferredProviderId,
          capability,
        });
      }

      const updated =
        await this.repository.assignJobProvider(
          jobId,
          {
            assignedAgentId:
              input.preferredAgentId ||
              selected.name,
            runtimeProviderId:
              selected.id,
            capability,
          },
        );

      return {
        jobId: updated.id,
        sessionId: updated.sessionId,
        assignedAgentId:
          updated.assignedAgentId!,
        runtimeProviderId:
          updated.runtimeProviderId!,
        capability:
          updated.capability!,
        score: 100,
        reasons: [
          "human-override",
          `provider:${selected.id}`,
        ],
        alternatives: [],
        humanOverride: true,
        assignedAt:
          new Date().toISOString(),
      };
    }

    const decision =
      await this.dispatcher.selectProvider({
        capability,
        scope: input.scope,
        preferredProviderId:
          input.preferredProviderId ??
          job.runtimeProviderId ??
          undefined,
        minimumHealth:
          input.minimumHealth,
        maximumWorkload:
          input.maximumWorkload,
      });

    const selected =
      decision.selected.provider;

    const assignedAgentId =
      input.preferredAgentId?.trim() ||
      selected.name;

    const updated =
      await this.repository.assignJobProvider(
        jobId,
        {
          assignedAgentId,
          runtimeProviderId:
            selected.id,
          capability,
        },
      );

    return {
      jobId: updated.id,
      sessionId: updated.sessionId,
      assignedAgentId:
        updated.assignedAgentId!,
      runtimeProviderId:
        updated.runtimeProviderId!,
      capability:
        updated.capability!,
      score: decision.selected.score,
      reasons:
        decision.selected.reasons,
      alternatives:
        decision.alternatives.map(
          (alternative) => ({
            providerId:
              alternative.provider.id,
            providerName:
              alternative.provider.name,
            score: alternative.score,
          }),
        ),
      humanOverride: false,
      assignedAt:
        new Date().toISOString(),
    };
  }

  async assignPendingJobs(
    sessionId: string,
  ): Promise<ExecutionJobAssignment[]> {
    const session =
      await this.repository.findSessionById(
        sessionId,
      );

    if (!session) {
      throw new NotFoundException(
        `Execution session was not found: ${sessionId}`,
      );
    }

    const assignments:
      ExecutionJobAssignment[] = [];

    const assignableJobs =
      session.jobs.filter(
        (job) =>
          job.status ===
            ExecutionStatus.PENDING &&
          !job.runtimeProviderId,
      );

    for (const job of assignableJobs) {
      if (!job.capability) {
        continue;
      }

      const assignment =
        await this.assignJob(
          job.id,
          {
            capability:
              job.capability,
          },
        );

      assignments.push(assignment);
    }

    return assignments;
  }
}