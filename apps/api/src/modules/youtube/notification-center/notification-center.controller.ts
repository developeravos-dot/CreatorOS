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
  CreateGrowthRecordInput,
  GrowthRecordPriority,
  GrowthRecordStatus,
  UpdateGrowthRecordInput,
} from '../growth-management-core/growth-management-engine.base';

import {
  NotificationCenterService,
} from './notification-center.service';

@Controller('youtube/notification-center')
export class NotificationCenterController {
  constructor(
    private readonly service: NotificationCenterService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('records')
  listRecords(
    @Query('status') status?: GrowthRecordStatus,
    @Query('priority') priority?: GrowthRecordPriority,
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
    @Body() input: CreateGrowthRecordInput,
  ) {
    return this.service.createRecord(input);
  }

  @Patch('records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() input: UpdateGrowthRecordInput,
  ) {
    return this.service.updateRecord(id, input);
  }

  @Post('records/:id/plan')
  planRecord(@Param('id') id: string) {
    return this.service.planRecord(id);
  }

  @Post('records/:id/start')
  startRecord(@Param('id') id: string) {
    return this.service.startRecord(id);
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
  recordProgress(
    @Param('id') id: string,
    @Body('currentValue') currentValue: number,
  ) {
    return this.service.recordProgress(
      id,
      currentValue,
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

  @Post('values/analyze')
  analyzeValues(
    @Body('values') values: number[],
  ) {
    return this.service.analyzeValues(values);
  }
}
