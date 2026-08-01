import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductionExecutionOptions, ProductionRequest } from '../contracts/production.contracts';
import { ProductionOrchestratorService } from '../orchestrator/production-orchestrator.service';

interface GenerateBody {
  request: ProductionRequest;
  execution?: ProductionExecutionOptions;
}

@Controller('production-framework')
export class ProductionFrameworkController {
  constructor(private readonly orchestrator: ProductionOrchestratorService) {}

  @Get('providers')
  providers() {
    return this.orchestrator.providers();
  }

  @Post('generate')
  generate(@Body() body: GenerateBody) {
    return this.orchestrator.generate(body.request, body.execution);
  }

  @Post('generate-wait-download')
  generateWaitDownload(@Body() body: GenerateBody) {
    return this.orchestrator.generate(body.request, {
      ...body.execution,
      waitForCompletion: true,
      download: true,
    });
  }

  @Get(':provider/tasks/:taskId')
  status(@Param('provider') provider: string, @Param('taskId') taskId: string) {
    return this.orchestrator.status(provider, taskId);
  }

  @Post(':provider/tasks/:taskId/download')
  download(
    @Param('provider') provider: string,
    @Param('taskId') taskId: string,
    @Body() body: { filename?: string },
  ) {
    return this.orchestrator.download(provider, taskId, body?.filename);
  }

  @Post(':provider/tasks/:taskId/cancel')
  async cancel(@Param('provider') provider: string, @Param('taskId') taskId: string) {
    await this.orchestrator.cancel(provider, taskId);
    return { success: true, provider, taskId, status: 'cancelled' };
  }
}
