import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { Public } from '../modules/core-v1/auth/public.decorator';
import {
  CreateProductionWorkflowRequest,
} from './production-execution.contracts';
import { ProductionExecutionService } from './production-execution.service';

@Public()
@Controller('enterprise/production-execution')
export class ProductionExecutionController {
  constructor(
    private readonly execution: ProductionExecutionService,
  ) {}

  @Get('status')
  status() {
    return this.execution.status();
  }

  @Post('workflows')
  create(@Body() request: CreateProductionWorkflowRequest) {
    return this.execution.create(request);
  }

  @Get('workflows')
  list() {
    return this.execution.list();
  }

  @Get('workflows/:id')
  get(@Param('id') id: string) {
    return this.execution.get(id);
  }

  @Get('workflows/:id/monitor')
  monitor(@Param('id') id: string) {
    return this.execution.monitor(id);
  }

  @Post('workflows/:id/run')
  run(@Param('id') id: string) {
    return this.execution.run(id);
  }

  @Post('workflows/:workflowId/steps/:stepId/complete')
  completeManualStep(
    @Param('workflowId') workflowId: string,
    @Param('stepId') stepId: string,
    @Body()
    input: {
      assetName?: string;
      assetLocation?: string;
      actualCost?: number;
      qualityScore?: number;
    },
  ) {
    return this.execution.completeManualStep(workflowId, stepId, input);
  }

  @Post('workflows/:id/cancel')
  cancel(@Param('id') id: string) {
    return this.execution.cancel(id);
  }
}