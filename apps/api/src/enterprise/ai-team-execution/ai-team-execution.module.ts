import {
  Module,
} from "@nestjs/common";

import {
  AiTeamExecutionController,
} from "./ai-team-execution.controller";

import {
  AiTeamExecutionRepository,
} from "./ai-team-execution.repository";

import {
  AiTeamExecutionService,
} from "./ai-team-execution.service";

@Module({
  controllers: [
    AiTeamExecutionController,
  ],
  providers: [
    AiTeamExecutionRepository,
    AiTeamExecutionService,
  ],
  exports: [
    AiTeamExecutionService,
  ],
})
export class AiTeamExecutionModule {}