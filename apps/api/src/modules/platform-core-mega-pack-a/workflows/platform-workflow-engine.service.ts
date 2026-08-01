import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  WorkflowDefinition,
  WorkflowStep,
} from '../platform-core.types';
import { CapabilityFabricService } from '../capabilities/capability-fabric.service';
import { PlatformEventBusService } from '../events/platform-event-bus.service';

@Injectable()
export class PlatformWorkflowEngineService {
  private readonly workflows = new Map<
    string,
    WorkflowDefinition
  >();

  constructor(
    private readonly capabilityFabric:
      CapabilityFabricService,
    private readonly eventBus:
      PlatformEventBusService,
  ) {}

  create(
    name: string,
    steps: Array<
      Omit<
        WorkflowStep,
        'id' | 'status'
      >
    >,
  ): WorkflowDefinition {
    const now = new Date().toISOString();

    const workflow: WorkflowDefinition = {
      id: randomUUID(),
      name,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      steps: steps.map((step) => ({
        ...step,
        id: randomUUID(),
        status: 'pending',
      })),
    };

    this.workflows.set(
      workflow.id,
      workflow,
    );

    return workflow;
  }

  prepare(workflowId: string) {
    const workflow = this.get(workflowId);

    for (const step of workflow.steps) {
      const capability =
        this.capabilityFabric.get(
          step.capability,
        );

      if (
        !capability.commands.includes(
          step.command,
        )
      ) {
        throw new Error(
          `Unsupported command ${step.command} for ${step.capability}`,
        );
      }
    }

    workflow.status = 'ready';
    workflow.updatedAt =
      new Date().toISOString();

    return workflow;
  }

  async execute(workflowId: string) {
    const workflow = this.get(workflowId);

    if (workflow.status !== 'ready') {
      throw new Error(
        'Workflow must be ready before execution.',
      );
    }

    workflow.status = 'running';

    for (const step of workflow.steps) {
      const blocked = step.dependsOn.some(
        (dependencyId) =>
          workflow.steps.find(
            (candidate) =>
              candidate.id === dependencyId,
          )?.status !== 'completed',
      );

      if (blocked) {
        step.status = 'blocked';
        workflow.status = 'failed';
        break;
      }

      const capability =
        this.capabilityFabric.get(
          step.capability,
        );

      if (capability.state !== 'active') {
        step.status = 'failed';
        workflow.status = 'failed';
        break;
      }

      step.status = 'running';

      const event =
        await this.eventBus.publish(
          'platform.command.executed',
          step.capability,
          {
            command: step.command,
            workflowId: workflow.id,
            stepId: step.id,
          },
          workflow.id,
        );

      step.output = {
        eventId: event.id,
        capability: step.capability,
        command: step.command,
      };
      step.status = 'completed';
    }

    if (
      workflow.steps.every(
        (step) =>
          step.status === 'completed',
      )
    ) {
      workflow.status = 'completed';
    }

    workflow.updatedAt =
      new Date().toISOString();

    return workflow;
  }

  list() {
    return [...this.workflows.values()];
  }

  get(workflowId: string) {
    const workflow =
      this.workflows.get(workflowId);

    if (!workflow) {
      throw new Error(
        `Workflow not found: ${workflowId}`,
      );
    }

    return workflow;
  }
}