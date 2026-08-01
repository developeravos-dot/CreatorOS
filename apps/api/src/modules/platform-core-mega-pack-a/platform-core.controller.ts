import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { PlatformCoreOrchestratorService } from './platform-core-orchestrator.service';

@Controller('platform/core')
export class PlatformCoreController {
  constructor(
    private readonly orchestrator:
      PlatformCoreOrchestratorService,
  ) {}

  @Post('bootstrap')
  bootstrap() {
    return this.orchestrator.bootstrap();
  }

  @Get('status')
  status() {
    return this.orchestrator.status();
  }

  @Post('workflows')
  createWorkflow(
    @Body()
    body: {
      name: string;
      steps: Array<{
        name: string;
        capability: string;
        command: string;
        dependsOn: string[];
      }>;
    },
  ) {
    return this.orchestrator.createWorkflow(
      body,
    );
  }

  @Post(
    'workflows/:workflowId/prepare',
  )
  prepareWorkflow(
    @Param('workflowId')
    workflowId: string,
  ) {
    return this.orchestrator.prepareWorkflow(
      workflowId,
    );
  }

  @Post(
    'workflows/:workflowId/execute',
  )
  executeWorkflow(
    @Param('workflowId')
    workflowId: string,
  ) {
    return this.orchestrator.executeWorkflow(
      workflowId,
    );
  }
}