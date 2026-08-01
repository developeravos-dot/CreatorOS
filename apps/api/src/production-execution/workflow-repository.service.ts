import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductionWorkflow } from './production-execution.contracts';

@Injectable()
export class WorkflowRepositoryService {
  private readonly workflows = new Map<string, ProductionWorkflow>();

  create(workflow: ProductionWorkflow): ProductionWorkflow {
    this.workflows.set(workflow.id, workflow);
    return this.clone(workflow);
  }

  save(workflow: ProductionWorkflow): ProductionWorkflow {
    workflow.updatedAt = new Date().toISOString();
    this.workflows.set(workflow.id, workflow);
    return this.clone(workflow);
  }

  get(id: string): ProductionWorkflow {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      throw new NotFoundException(`Production workflow not found: ${id}`);
    }

    return this.clone(workflow);
  }

  getMutable(id: string): ProductionWorkflow {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      throw new NotFoundException(`Production workflow not found: ${id}`);
    }

    return workflow;
  }

  list(): ProductionWorkflow[] {
    return [...this.workflows.values()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((workflow) => this.clone(workflow));
  }

  private clone(workflow: ProductionWorkflow): ProductionWorkflow {
    return structuredClone(workflow);
  }
}