import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  CreateOperationInput,
  OperationPriority,
  OperationStatus,
  UpdateOperationInput,
} from '../operations-core/operations-engine.base';

import {
  RecommendationEngineService,
} from './recommendation-engine.service';

@Controller('youtube/recommendation-engine')
export class RecommendationEngineController {
  constructor(
    private readonly service: RecommendationEngineService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('records')
  listRecords(
    @Query('status') status?: OperationStatus,
    @Query('priority') priority?: OperationPriority,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('minimumScore') minimumScore?: string,
  ) {
    return this.service.listRecords({
      status,
      priority,
      category,
      search,
      minimumScore:
        minimumScore !== undefined
          ? Number(minimumScore)
          : undefined,
    });
  }

  @Get('records/top')
  getTopRecords(
    @Query('limit') limit?: string,
  ) {
    return this.service.getTopRecords(
      Number(limit ?? 10),
    );
  }

  @Get('records/:id')
  getRecord(@Param('id') id: string) {
    return this.service.getRecord(id);
  }

  @Post('records')
  createRecord(
    @Body() input: CreateOperationInput,
  ) {
    return this.service.createRecord(input);
  }

  @Patch('records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() input: UpdateOperationInput,
  ) {
    return this.service.updateRecord(id, input);
  }

  @Post('records/:id/schedule')
  scheduleRecord(
    @Param('id') id: string,
    @Body('scheduledAt') scheduledAt: string,
  ) {
    return this.service.scheduleRecord(
      id,
      scheduledAt,
    );
  }

  @Post('records/:id/activate')
  activateRecord(@Param('id') id: string) {
    return this.service.activateRecord(id);
  }

  @Post('records/:id/pause')
  pauseRecord(@Param('id') id: string) {
    return this.service.pauseRecord(id);
  }

  @Post('records/:id/complete')
  completeRecord(@Param('id') id: string) {
    return this.service.completeRecord(id);
  }

  @Post('records/:id/cancel')
  cancelRecord(@Param('id') id: string) {
    return this.service.cancelRecord(id);
  }

  @Post('records/:id/progress')
  updateProgress(
    @Param('id') id: string,
    @Body('progress') progress: number,
  ) {
    return this.service.updateProgress(
      id,
      progress,
    );
  }

  @Get('records/:id/recommendations')
  generateRecommendations(
    @Param('id') id: string,
  ) {
    return this.service.generateRecommendations(id);
  }

  @Delete('records/:id')
  removeRecord(@Param('id') id: string) {
    return this.service.removeRecord(id);
  }

  @Post('metrics/analyze')
  analyzeMetrics(
    @Body('values') values: number[],
  ) {
    return this.service.analyzeMetrics(values);
  }
}
