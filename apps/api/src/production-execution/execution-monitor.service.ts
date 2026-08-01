import { Injectable } from '@nestjs/common';
import { ProductionWorkflow } from './production-execution.contracts';

@Injectable()
export class ExecutionMonitorService {
  snapshot(workflow: ProductionWorkflow) {
    const total = workflow.steps.length;
    const completed = workflow.steps.filter(
      (step) => step.status === 'completed',
    ).length;
    const failed = workflow.steps.filter(
      (step) => step.status === 'failed',
    ).length;
    const manual = workflow.steps.filter(
      (step) => step.status === 'manual-required',
    ).length;

    return {
      workflowId: workflow.id,
      status: workflow.status,
      progressPercent: total === 0 ? 0 : Math.round((completed / total) * 100),
      totalSteps: total,
      completedSteps: completed,
      failedSteps: failed,
      manualSteps: manual,
      estimatedCost: workflow.estimatedCost,
      actualCost: workflow.actualCost,
      currentStepId: workflow.currentStepId,
      updatedAt: workflow.updatedAt,
    };
  }
}