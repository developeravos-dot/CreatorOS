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
  CreateGlobalExpansionInput,
  GlobalExpansionPriority,
  GlobalExpansionProject,
  GlobalExpansionStage,
  GlobalExpansionStatus,
} from '../media-global-expansion-core/media-global-expansion-engine.base';

import {
  RevenueOptimizationStageService,
} from './revenue-optimization-stage.service';

@Controller('media/global-expansion/revenue-optimization')
export class RevenueOptimizationStageController {
  constructor(
    private readonly service: RevenueOptimizationStageService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('blueprint')
  getBlueprint() {
    return this.service.getBlueprint();
  }

  @Get('projects')
  listProjects(
    @Query('status')
    status?: GlobalExpansionStatus,
    @Query('priority')
    priority?: GlobalExpansionPriority,
    @Query('stage')
    stage?: GlobalExpansionStage,
    @Query('owner')
    owner?: string,
    @Query('search')
    search?: string,
  ) {
    return this.service.listProjects({
      status,
      priority,
      stage,
      owner,
      search,
    });
  }

  @Post('projects')
  createProject(
    @Body() input: CreateGlobalExpansionInput,
  ) {
    return this.service.createProject(input);
  }

  @Get('projects/:id')
  getProject(@Param('id') id: string) {
    return this.service.getProject(id);
  }

  @Patch('projects/:id')
  updateProject(
    @Param('id') id: string,
    @Body() input: Partial<GlobalExpansionProject>,
  ) {
    return this.service.updateProject(id, input);
  }

  @Post('projects/:id/human-approve-autonomy')
  approveAutonomousExecution(
    @Param('id') id: string,
    @Body('approvedBy') approvedBy: string,
  ) {
    return this.service.approveAutonomousExecution(
      id,
      approvedBy,
    );
  }

  @Post('projects/:id/start')
  startExpansion(@Param('id') id: string) {
    return this.service.startExpansion(id);
  }

  @Post('projects/:id/execute-stage')
  executeManagedStage(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.executeManagedStage(
      id,
      input as never,
    );
  }

  @Post('projects/:id/complete-stage')
  completeManagedStage(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.completeManagedStage(
      id,
      input as never,
    );
  }

  @Post('projects/:id/stages/:stage/human-review')
  submitStageForHumanReview(
    @Param('id') id: string,
    @Param('stage')
    stage: GlobalExpansionStage,
  ) {
    return this.service.submitStageForHumanReview(
      id,
      stage,
    );
  }

  @Post('projects/:id/stages/:stage/human-approve')
  approveStage(
    @Param('id') id: string,
    @Param('stage')
    stage: GlobalExpansionStage,
    @Body('approvedBy') approvedBy: string,
  ) {
    return this.service.approveStage(
      id,
      stage,
      approvedBy,
    );
  }

  @Post('projects/:id/stages/:stage/human-reject')
  rejectStage(
    @Param('id') id: string,
    @Param('stage')
    stage: GlobalExpansionStage,
    @Body('reason') reason: string,
    @Body('decidedBy') decidedBy: string,
  ) {
    return this.service.rejectStage(
      id,
      stage,
      reason,
      decidedBy,
    );
  }

  @Post('projects/:id/markets')
  addMarket(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.addMarket(
      id,
      input as never,
    );
  }

  @Get('projects/:id/markets/ranked')
  getRankedMarkets(
    @Param('id') id: string,
  ) {
    return this.service.getRankedMarkets(id);
  }

  @Post('projects/:id/markets/:marketId/human-approve')
  approveMarket(
    @Param('id') id: string,
    @Param('marketId') marketId: string,
  ) {
    return this.service.approveMarket(
      id,
      marketId,
    );
  }

  @Post('projects/:id/partners')
  addPartner(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.addPartner(
      id,
      input as never,
    );
  }

  @Post('projects/:id/partners/:partnerId/human-approve')
  approvePartner(
    @Param('id') id: string,
    @Param('partnerId') partnerId: string,
  ) {
    return this.service.approvePartner(
      id,
      partnerId,
    );
  }

  @Post('projects/:id/reinvestment')
  calculateReinvestment(
    @Param('id') id: string,
    @Body('percentage') percentage: number,
  ) {
    return this.service.calculateReinvestment(
      id,
      percentage,
    );
  }

  @Get('projects/:id/market-entry-plan')
  generateMarketEntryPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateMarketEntryPlan(
      id,
    );
  }

  @Get('projects/:id/report')
  generateGlobalExpansionReport(
    @Param('id') id: string,
  ) {
    return this.service.generateGlobalExpansionReport(
      id,
    );
  }

  @Delete('projects/:id')
  removeProject(@Param('id') id: string) {
    return this.service.removeProject(id);
  }
}
