import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  OperationalWorkflow,
  OrganizationBrief,
  WorkflowStep,
} from '../organization-automation.types';

@Injectable()
export class WorkflowOrchestrationService {
  createDefaultWorkflows(
    brief: OrganizationBrief,
  ): OperationalWorkflow[] {
    return brief.objectives.map((objective, index) =>
      this.create(
        `Workflow ${index + 1}`,
        objective,
        index + 1,
      ),
    );
  }

  create(
    name: string,
    objective: string,
    priority: number,
  ): OperationalWorkflow {
    const now = new Date().toISOString();
    const steps: WorkflowStep[] = [
      {
        id: randomUUID(),
        name: 'Analyze Objective',
        ownerRole: 'Research Intelligence Specialist',
        dependsOn: [],
        requiresHumanApproval: false,
        status: 'ready',
      },
      {
        id: randomUUID(),
        name: 'Design Execution Plan',
        ownerRole: 'Operations Coordinator',
        dependsOn: [],
        requiresHumanApproval: false,
        status: 'pending',
      },
      {
        id: randomUUID(),
        name: 'Quality and Safety Review',
        ownerRole: 'Quality and Safety Reviewer',
        dependsOn: [],
        requiresHumanApproval: false,
        status: 'pending',
      },
      {
        id: randomUUID(),
        name: 'Human Approval Gate',
        ownerRole: 'Human Final Authority',
        dependsOn: [],
        requiresHumanApproval: true,
        status: 'pending',
      },
      {
        id: randomUUID(),
        name: 'Execute and Record',
        ownerRole: 'Production Coordinator',
        dependsOn: [],
        requiresHumanApproval: false,
        status: 'pending',
      },
    ];

    for (let index = 1; index < steps.length; index += 1) {
      const previous = steps[index - 1];
      const current = steps[index];

      if (previous && current) {
        current.dependsOn = [previous.id];
      }
    }

    return {
      id: randomUUID(),
      name,
      objective,
      status: 'ready',
      priority,
      createdAt: now,
      updatedAt: now,
      steps,
    };
  }

  start(workflow: OperationalWorkflow) {
    if (!['ready', 'blocked'].includes(workflow.status)) {
      throw new Error('Workflow is not ready to start.');
    }

    workflow.status = 'running';
    workflow.blockedReason = undefined;
    workflow.updatedAt = new Date().toISOString();
    return workflow;
  }

  completeStep(
    workflow: OperationalWorkflow,
    stepId: string,
    output: Record<string, unknown>,
  ) {
    const step = workflow.steps.find((item) => item.id === stepId);

    if (!step) {
      throw new Error(`Workflow step not found: ${stepId}`);
    }

    const dependenciesCompleted = step.dependsOn.every((dependencyId) =>
      workflow.steps.some(
        (item) =>
          item.id === dependencyId &&
          item.status === 'completed',
      ),
    );

    if (!dependenciesCompleted) {
      throw new Error('Workflow step dependencies are not completed.');
    }

    if (step.requiresHumanApproval) {
      throw new Error('Human approval step must use the approval system.');
    }

    step.status = 'completed';
    step.output = output;

    const next = workflow.steps.find(
      (item) =>
        item.status === 'pending' &&
        item.dependsOn.every((dependencyId) =>
          workflow.steps.some(
            (candidate) =>
              candidate.id === dependencyId &&
              candidate.status === 'completed',
          ),
        ),
    );

    if (next) {
      next.status = 'ready';
    }

    if (
      workflow.steps.every(
        (item) => item.status === 'completed',
      )
    ) {
      workflow.status = 'completed';
    }

    workflow.updatedAt = new Date().toISOString();
    return workflow;
  }

  approveHumanStep(
    workflow: OperationalWorkflow,
    stepId: string,
    approved: boolean,
  ) {
    const step = workflow.steps.find((item) => item.id === stepId);

    if (!step || !step.requiresHumanApproval) {
      throw new Error('Human approval step not found.');
    }

    if (!approved) {
      step.status = 'blocked';
      workflow.status = 'blocked';
      workflow.blockedReason = 'human-approval-rejected';
      workflow.updatedAt = new Date().toISOString();
      return workflow;
    }

    step.status = 'completed';

    const next = workflow.steps.find(
      (item) =>
        item.status === 'pending' &&
        item.dependsOn.every((dependencyId) =>
          workflow.steps.some(
            (candidate) =>
              candidate.id === dependencyId &&
              candidate.status === 'completed',
          ),
        ),
    );

    if (next) {
      next.status = 'ready';
    }

    workflow.updatedAt = new Date().toISOString();
    return workflow;
  }
}