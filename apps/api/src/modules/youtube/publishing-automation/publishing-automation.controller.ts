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
  AutomationPriority,
  AutomationStatus,
  AutomationType,
  CreateAutomationRecordInput,
  ExecutionMode,
  UpdateAutomationRecordInput,
} from '../automation-orchestration-core/automation-orchestration-engine.base';

import {
  PublishingAutomationService,
} from './publishing-automation.service';

@Controller('youtube/publishing-automation')
export class PublishingAutomationController {
  constructor(
    private readonly service: PublishingAutomationService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('command-center')
  getCommandCenter() {
    return this.service.getCommandCenter();
  }

  @Get('records')
  listRecords(
    @Query('status') status?: AutomationStatus,
    @Query('priority') priority?: AutomationPriority,
    @Query('type') type?: AutomationType,
    @Query('executionMode')
    executionMode?: ExecutionMode,
    @Query('category') category?: string,
    @Query('owner') owner?: string,
    @Query('assignedAgent')
    assignedAgent?: string,
    @Query('search') search?: string,
    @Query('minimumQualityScore')
    minimumQualityScore?: string,
  ) {
    return this.service.listRecords({
      status,
      priority,
      type,
      executionMode,
      category,
      owner,
      assignedAgent,
      search,
      minimumQualityScore:
        minimumQualityScore !== undefined
          ? Number(minimumQualityScore)
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

  @Get('records/:id/execution-plan')
  generateExecutionPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateExecutionPlan(id);
  }

  @Get('records/:id/quality-check')
  runQualityCheck(
    @Param('id') id: string,
  ) {
    return this.service.runQualityCheck(id);
  }

  @Post('records')
  createRecord(
    @Body() input: CreateAutomationRecordInput,
  ) {
    return this.service.createRecord(input);
  }

  @Patch('records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() input: UpdateAutomationRecordInput,
  ) {
    return this.service.updateRecord(id, input);
  }

  @Post('records/:id/queue')
  queueRecord(@Param('id') id: string) {
    return this.service.queueRecord(id);
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
  completeRecord(
    @Param('id') id: string,
    @Body('result')
    result?: Record<string, unknown>,
  ) {
    return this.service.completeRecord(
      id,
      result,
    );
  }

  @Post('records/:id/fail')
  failRecord(
    @Param('id') id: string,
    @Body('error') error: string,
  ) {
    return this.service.failRecord(id, error);
  }

  @Post('records/:id/retry')
  retryRecord(@Param('id') id: string) {
    return this.service.retryRecord(id);
  }

  @Post('records/:id/cancel')
  cancelRecord(@Param('id') id: string) {
    return this.service.cancelRecord(id);
  }

  @Post('records/:id/assign-agent')
  assignAgent(
    @Param('id') id: string,
    @Body('agent') agent: string,
  ) {
    return this.service.assignAgent(id, agent);
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

  @Delete('records/:id')
  removeRecord(@Param('id') id: string) {
    return this.service.removeRecord(id);
  }
}
