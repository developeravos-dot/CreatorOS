import { Controller, Get, Query } from "@nestjs/common";
import { WorkflowOrchestratorService } from "../services/workflow-orchestrator.service";

@Controller("enterprise/ai-team-execution/workflow")
export class WorkflowEngineController {

  constructor(
    private readonly orchestrator: WorkflowOrchestratorService,
  ) {}

  @Get("plan")
  createPlan(
    @Query("project")
    project: string,
  ) {

    return this.orchestrator.createWorkflow(
      project ?? "YouTube Production",
    );

  }

}
