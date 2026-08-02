import {
  Controller,
  Get,
  Param,
} from "@nestjs/common";

import {
  AiTeamExecutionService,
} from "./ai-team-execution.service";

@Controller("enterprise/ai-team-execution")
export class AiTeamExecutionController {
  @Get("status")
  getStatus() {
    return {
      success: true,
      module: "AiTeamExecutionModule",
      controller: "AiTeamExecutionController",
      status: "operational",
    };
  }


  constructor(
    private readonly service: AiTeamExecutionService,
  ) {
    console.log("AI TEAM EXECUTION CLEAN CONTROLLER CREATED");
  }


  @Get("health")
  health() {
    return {
      module: "ai-team-execution",
      status: "ok",
    };
  }


  @Get("sessions")
  sessions() {
    return this.service.listSessions();
  }


  @Get("intelligence/analyze/:executionId")
  analyze(
    @Param("executionId")
    executionId: string,
  ) {
    return {
      executionId,
      status: "analyzed",
    };
  }
}

