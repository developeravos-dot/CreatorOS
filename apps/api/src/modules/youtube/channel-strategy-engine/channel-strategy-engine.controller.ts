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
  CreateStrategyRecordInput,
  RiskLevel,
  StrategyPriority,
  StrategyStatus,
  StrategyType,
  UpdateStrategyRecordInput,
} from '../intelligence-strategy-core/intelligence-strategy-engine.base';

import {
  ChannelStrategyEngineService,
} from './channel-strategy-engine.service';

@Controller('youtube/channel-strategy-engine')
export class ChannelStrategyEngineController {
  constructor(
    private readonly service: ChannelStrategyEngineService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('records')
  listRecords(
    @Query('status') status?: StrategyStatus,
    @Query('priority') priority?: StrategyPriority,
    @Query('type') type?: StrategyType,
    @Query('riskLevel') riskLevel?: RiskLevel,
    @Query('category') category?: string,
    @Query('owner') owner?: string,
    @Query('market') market?: string,
    @Query('search') search?: string,
    @Query('minimumStrategicScore')
    minimumStrategicScore?: string,
  ) {
    return this.service.listRecords({
      status,
      priority,
      type,
      riskLevel,
      category,
      owner,
      market,
      search,
      minimumStrategicScore:
        minimumStrategicScore !== undefined
          ? Number(minimumStrategicScore)
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

  @Get('records/:id/opportunity')
  analyzeOpportunity(
    @Param('id') id: string,
  ) {
    return this.service.analyzeOpportunity(id);
  }

  @Get('records/:id/investment-case')
  calculateInvestmentCase(
    @Param('id') id: string,
  ) {
    return this.service.calculateInvestmentCase(id);
  }

  @Get('records/:id/strategic-plan')
  generateStrategicPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateStrategicPlan(id);
  }

  @Get('records/:id/executive-summary')
  getExecutiveSummary(
    @Param('id') id: string,
  ) {
    return this.service.getExecutiveSummary(id);
  }

  @Post('records')
  createRecord(
    @Body() input: CreateStrategyRecordInput,
  ) {
    return this.service.createRecord(input);
  }

  @Patch('records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() input: UpdateStrategyRecordInput,
  ) {
    return this.service.updateRecord(id, input);
  }

  @Post('records/:id/analyze')
  startAnalysis(@Param('id') id: string) {
    return this.service.startAnalysis(id);
  }

  @Post('records/:id/recommend')
  recommendRecord(
    @Param('id') id: string,
    @Body('rationale') rationale: string,
  ) {
    return this.service.recommendRecord(
      id,
      rationale,
    );
  }

  @Post('records/:id/approve')
  approveRecord(
    @Param('id') id: string,
    @Body('decision') decision: string,
  ) {
    return this.service.approveRecord(
      id,
      decision,
    );
  }

  @Post('records/:id/execute')
  executeRecord(@Param('id') id: string) {
    return this.service.executeRecord(id);
  }

  @Post('records/:id/complete')
  completeRecord(@Param('id') id: string) {
    return this.service.completeRecord(id);
  }

  @Post('records/:id/reject')
  rejectRecord(
    @Param('id') id: string,
    @Body('rationale') rationale: string,
  ) {
    return this.service.rejectRecord(
      id,
      rationale,
    );
  }

  @Post('records/:id/archive')
  archiveRecord(@Param('id') id: string) {
    return this.service.archiveRecord(id);
  }

  @Post('records/:id/signals')
  addSignal(
    @Param('id') id: string,
    @Body('signal') signal: string,
  ) {
    return this.service.addSignal(id, signal);
  }

  @Delete('records/:id')
  removeRecord(@Param('id') id: string) {
    return this.service.removeRecord(id);
  }
}
