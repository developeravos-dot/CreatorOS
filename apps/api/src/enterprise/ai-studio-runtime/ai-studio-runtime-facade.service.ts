import { Injectable } from "@nestjs/common";
import { AiStudioRuntimeCommandService } from "./ai-studio-runtime-command.service";
import { AiStudioRuntimeRegistryService } from "./ai-studio-runtime-registry.service";
import type {
  AiStudioRuntimeCapability,
  AiStudioRuntimeCommandRequest,
} from "./ai-studio-runtime.contracts";

@Injectable()
export class AiStudioRuntimeFacadeService {
  constructor(
    private readonly registry: AiStudioRuntimeRegistryService,
    private readonly commands: AiStudioRuntimeCommandService,
  ) {}

  getOverview() {
    return this.registry.getOverview();
  }

  getProviders(capability?: AiStudioRuntimeCapability) {
    return this.registry.getProviders(capability);
  }

  getAgents() {
    return this.registry.getAgents();
  }

  getTasks() {
    return this.registry.getTasks();
  }

  getWorkflows() {
    return this.registry.getWorkflows();
  }

  getApprovals() {
    return this.registry.getApprovals();
  }

  getMemory() {
    return this.registry.getMemoryProviders();
  }

  getModels() {
    return this.registry.getModels();
  }

  getExecutions() {
    return this.registry.getExecutions();
  }

  getTools() {
    return this.registry.getTools();
  }

  getQueues() {
    return this.registry.getQueues();
  }

  getLogs() {
    return this.registry.getLogs();
  }

  executeCommand(request: AiStudioRuntimeCommandRequest) {
    return this.commands.execute(request);
  }

  getExecutionHistory() {
    return this.commands.getHistory();
  }

  getExecution(executionId: string) {
    return this.commands.getExecution(executionId);
  }

  approveExecution(executionId: string) {
    return this.commands.approve(executionId);
  }

  rejectExecution(executionId: string) {
    return this.commands.reject(executionId);
  }

  getHealth() {
    const overview = this.registry.getOverview();

    return {
      status: overview.status,
      health: overview.health,
      providers: overview.providers,
      generatedAt: overview.generatedAt,
    };
  }
}
