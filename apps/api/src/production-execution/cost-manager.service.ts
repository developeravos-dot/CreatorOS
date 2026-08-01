import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductionWorkflow, WorkflowStep } from './production-execution.contracts';

@Injectable()
export class CostManagerService {
  estimateStep(toolCostTier?: string): number {
    switch (toolCostTier) {
      case 'high':
        return 2;
      case 'medium':
        return 0.5;
      case 'low':
        return 0.1;
      default:
        return 0;
    }
  }

  assertBudget(workflow: ProductionWorkflow, step: WorkflowStep): void {
    if (workflow.budgetLimit === undefined) {
      return;
    }

    const projected = workflow.actualCost + step.estimatedCost;
    if (projected > workflow.budgetLimit) {
      throw new BadRequestException(
        `Workflow budget limit exceeded. Projected=${projected}, limit=${workflow.budgetLimit}`,
      );
    }
  }

  recordStepCost(
    workflow: ProductionWorkflow,
    step: WorkflowStep,
    cost: number,
  ): void {
    step.actualCost += cost;
    workflow.actualCost += cost;
  }
}