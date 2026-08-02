import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { AiStudioRuntimeFacadeService } from "./ai-studio-runtime-facade.service";
import type {
  AiStudioRuntimeCapability,
  AiStudioRuntimeCommandRequest,
} from "./ai-studio-runtime.contracts";

@Controller("enterprise/ai-studio/runtime")
export class AiStudioRuntimeController {
  constructor(
    private readonly runtime: AiStudioRuntimeFacadeService,
  ) {}

  @Get("overview")
  getOverview() {
    return this.runtime.getOverview();
  }

  @Get("providers")
  getProviders(
    @Query("capability")
    capability?: AiStudioRuntimeCapability,
  ) {
    return this.runtime.getProviders(capability);
  }

  @Get("agents")
  getAgents() {
    return this.runtime.getAgents();
  }

  @Get("tasks")
  getTasks() {
    return this.runtime.getTasks();
  }

  @Get("workflows")
  getWorkflows() {
    return this.runtime.getWorkflows();
  }

  @Get("approvals")
  getApprovals() {
    return this.runtime.getApprovals();
  }

  @Get("memory")
  getMemory() {
    return this.runtime.getMemory();
  }

  @Get("models")
  getModels() {
    return this.runtime.getModels();
  }

  @Get("executions")
  getExecutions() {
    return this.runtime.getExecutions();
  }

  @Get("tools")
  getTools() {
    return this.runtime.getTools();
  }

  @Get("queues")
  getQueues() {
    return this.runtime.getQueues();
  }

  @Get("logs")
  getLogs() {
    return this.runtime.getLogs();
  }

  @Get("health")
  getHealth() {
    return this.runtime.getHealth();
  }

  @Post("commands")
  executeCommand(
    @Body() request: AiStudioRuntimeCommandRequest,
  ) {
    return this.runtime.executeCommand(request);
  }

  @Get("execution-history")
  getExecutionHistory() {
    return this.runtime.getExecutionHistory();
  }

  @Get("execution-history/:executionId")
  getExecution(
    @Param("executionId") executionId: string,
  ) {
    return this.runtime.getExecution(executionId);
  }

  @Post("execution-history/:executionId/approve")
  approveExecution(
    @Param("executionId") executionId: string,
  ) {
    return this.runtime.approveExecution(executionId);
  }

  @Post("execution-history/:executionId/reject")
  rejectExecution(
    @Param("executionId") executionId: string,
  ) {
    return this.runtime.rejectExecution(executionId);
  }
}
