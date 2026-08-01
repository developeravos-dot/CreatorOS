import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  BrandIdentity,
  CreateCreativeMediaProjectInput,
  CreativeMediaProject,
  CreativeMediaStage,
  ProductionBlueprint,
} from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';
import { CreativeExperimentationStageService } from './creative-experimentation-stage.service';

@Controller('media/creative-ecosystem/creative-experimentation')
export class CreativeExperimentationStageController {
  constructor(private readonly service: CreativeExperimentationStageService) {}

  @Get('dashboard') getDashboard() { return this.service.getDashboard(); }
  @Get('blueprint') getBlueprint() { return this.service.getBlueprint(); }
  @Get('projects') listProjects() { return this.service.listProjects(); }
  @Post('projects') createProject(@Body() input: CreateCreativeMediaProjectInput) { return this.service.createProject(input); }
  @Get('projects/:id') getProject(@Param('id') id: string) { return this.service.getProject(id); }
  @Patch('projects/:id') updateProject(@Param('id') id: string, @Body() input: Partial<CreativeMediaProject>) { return this.service.updateProject(id, input); }
  @Delete('projects/:id') removeProject(@Param('id') id: string) { return this.service.removeProject(id); }
  @Post('projects/:id/approve-autonomy') approveAutonomy(@Param('id') id: string, @Body('approvedBy') approvedBy: string) { return this.service.approveAutonomy(id, approvedBy); }
  @Post('projects/:id/start') startLifecycle(@Param('id') id: string) { return this.service.startLifecycle(id); }
  @Post('projects/:id/execute-stage') executeStage(@Param('id') id: string, @Body() input: Record<string, unknown>) { return this.service.executeManagedStage(id, input as never); }
  @Post('projects/:id/complete-stage') completeStage(@Param('id') id: string, @Body() input: Record<string, unknown>) { return this.service.completeManagedStage(id, input as never); }
  @Post('projects/:id/stages/:stage/review') reviewStage(@Param('id') id: string, @Param('stage') stage: CreativeMediaStage) { return this.service.submitHumanReview(id, stage); }
  @Post('projects/:id/stages/:stage/approve') approveStage(@Param('id') id: string, @Param('stage') stage: CreativeMediaStage, @Body('approvedBy') approvedBy: string) { return this.service.approveStage(id, stage, approvedBy); }
  @Post('projects/:id/brand-identity') setBrandIdentity(@Param('id') id: string, @Body() input: Partial<BrandIdentity>) { return this.service.setBrandIdentity(id, input); }
  @Post('projects/:id/production-blueprint') setProductionBlueprint(@Param('id') id: string, @Body() input: Partial<ProductionBlueprint>) { return this.service.setProductionBlueprint(id, input); }
  @Post('projects/:id/assets') addAsset(@Param('id') id: string, @Body() input: Record<string, unknown>) { return this.service.addAsset(id, input); }
  @Post('projects/:id/templates') addTemplate(@Param('id') id: string, @Body() input: Record<string, unknown>) { return this.service.addTemplate(id, input); }
  @Post('projects/:id/experiments') addExperiment(@Param('id') id: string, @Body() input: Record<string, unknown>) { return this.service.addExperiment(id, input); }
  @Post('projects/:id/analytics') updateAnalytics(@Param('id') id: string, @Body() input: Record<string, unknown>) { return this.service.updateAnalytics(id, input); }
  @Get('projects/:id/production-plan') productionPlan(@Param('id') id: string) { return this.service.generateProductionPlan(id); }
  @Get('projects/:id/brand-book') brandBook(@Param('id') id: string) { return this.service.generateBrandBook(id); }
  @Get('projects/:id/report') report(@Param('id') id: string) { return this.service.generateEcosystemReport(id); }
}
