import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { AiGatewayService } from './ai-gateway.service';
import { ExecuteAiTaskDto } from './dto/execute-ai-task.dto';
import { ModelRegistryService } from './model-registry.service';
import { PromptEngineService } from './prompt-engine.service';
import { TaskRouterService } from './task-router.service';

@ApiTags('CreatorOS AI Foundation')
@ApiBearerAuth()
@Controller('enterprise/ai-foundation')
export class AiFoundationController {
  constructor(
    private readonly gateway: AiGatewayService,
    private readonly registry: ModelRegistryService,
    private readonly promptEngine: PromptEngineService,
    private readonly taskRouter: TaskRouterService,
  ) {}

  @Get('status')
  status() {
    return this.gateway.getStatus();
  }

  @Get('models')
  models() {
    return this.registry.getStatus();
  }

  @Get('prompts')
  prompts() {
    return this.promptEngine.listTemplates();
  }

  @Get('routing')
  routing() {
    return this.taskRouter.getStatus();
  }

  @Post('execute')
  execute(@Body() input: ExecuteAiTaskDto) {
    return this.gateway.execute(input);
  }
}
