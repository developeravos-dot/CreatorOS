import { Injectable } from '@nestjs/common';
import {
  CompleteTaskInput,
  CreateWorkflowDefinitionInput,
  FailTaskInput,
  InMemoryWorkflowEngine,
  StartWorkflowInput,
} from '@creatoros/workflow';

@Injectable()
export class WorkflowService {
  private readonly engine =
    new InMemoryWorkflowEngine();

  createDefinition(
    input: CreateWorkflowDefinitionInput,
  ) {
    return this.engine.createDefinition(input);
  }

  getDefinitions() {
    const definitions =
      this.engine.getDefinitions();

    return {
      registry: 'workflow-definitions',
      status: 'operational',
      count: definitions.length,
      definitions,
    };
  }

  getDefinitionById(definitionId: string) {
    return this.engine.getDefinitionById(
      definitionId,
    );
  }

  startWorkflow(input: StartWorkflowInput) {
    return this.engine.startWorkflow(input);
  }

  getInstances() {
    const instances =
      this.engine.getInstances();

    return {
      registry: 'workflow-instances',
      status: 'operational',
      count: instances.length,
      instances,
    };
  }

  getInstanceById(instanceId: string) {
    return this.engine.getInstanceById(
      instanceId,
    );
  }

  completeCurrentTask(
    instanceId: string,
    input: CompleteTaskInput,
  ) {
    return this.engine.completeCurrentTask(
      instanceId,
      input,
    );
  }

  failCurrentTask(
    instanceId: string,
    input: FailTaskInput,
  ) {
    return this.engine.failCurrentTask(
      instanceId,
      input,
    );
  }

  pauseWorkflow(instanceId: string) {
    return this.engine.pauseWorkflow(instanceId);
  }

  resumeWorkflow(instanceId: string) {
    return this.engine.resumeWorkflow(instanceId);
  }

  cancelWorkflow(instanceId: string) {
    return this.engine.cancelWorkflow(instanceId);
  }

  getStatus() {
    return {
      module: 'workflow',
      ...this.engine.getStatus(),
    };
  }
}
