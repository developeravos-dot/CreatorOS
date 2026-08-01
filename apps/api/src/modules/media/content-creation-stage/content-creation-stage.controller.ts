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
  CreateLifecycleProjectInput,
  LifecyclePriority,
  LifecycleStage,
  LifecycleStatus,
  MediaLifecycleProject,
} from '../media-autonomous-lifecycle-core/media-autonomous-lifecycle-engine.base';

import {
  ContentCreationStageService,
} from './content-creation-stage.service';

@Controller('media/lifecycle/content-creation')
export class ContentCreationStageController {
  constructor(
    private readonly service: ContentCreationStageService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('blueprint')
  getLifecycleBlueprint() {
    return this.service.getLifecycleBlueprint();
  }

  @Get('projects')
  listProjects(
    @Query('status')
    status?: LifecycleStatus,
    @Query('priority')
    priority?: LifecyclePriority,
    @Query('stage')
    stage?: LifecycleStage,
    @Query('owner')
    owner?: string,
    @Query('platform')
    platform?: string,
    @Query('region')
    region?: string,
    @Query('search')
    search?: string,
  ) {
    return this.service.listProjects({
      status,
      priority,
      stage,
      owner,
      platform,
      region,
      search,
    });
  }

  @Post('projects')
  createProject(
    @Body() input: CreateLifecycleProjectInput,
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
    @Body() input: Partial<MediaLifecycleProject>,
  ) {
    return this.service.updateProject(id, input);
  }

  @Get('projects/:id/report')
  generateLifecycleReport(
    @Param('id') id: string,
  ) {
    return this.service.generateLifecycleReport(id);
  }

  @Get('projects/:id/next-best-action')
  generateNextBestAction(
    @Param('id') id: string,
  ) {
    return this.service.generateNextBestAction(id);
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
  startLifecycle(@Param('id') id: string) {
    return this.service.startLifecycle(id);
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
    @Param('stage') stage: LifecycleStage,
  ) {
    return this.service.submitStageForHumanReview(
      id,
      stage,
    );
  }

  @Post('projects/:id/stages/:stage/human-approve')
  approveStage(
    @Param('id') id: string,
    @Param('stage') stage: LifecycleStage,
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
    @Param('stage') stage: LifecycleStage,
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

  @Post('projects/:id/stages/:stage/block')
  blockStage(
    @Param('id') id: string,
    @Param('stage') stage: LifecycleStage,
    @Body('blocker') blocker: string,
  ) {
    return this.service.blockStage(
      id,
      stage,
      blocker,
    );
  }

  @Post('projects/:id/stages/:stage/resume')
  resumeStage(
    @Param('id') id: string,
    @Param('stage') stage: LifecycleStage,
  ) {
    return this.service.resumeStage(
      id,
      stage,
    );
  }

  @Post('projects/:id/automatic-transition')
  runAutomaticTransition(
    @Param('id') id: string,
  ) {
    return this.service.runAutomaticTransition(id);
  }

  @Post('projects/:id/learnings')
  addLearning(
    @Param('id') id: string,
    @Body('lesson') lesson: string,
  ) {
    return this.service.addLearning(id, lesson);
  }

  @Delete('projects/:id')
  removeProject(@Param('id') id: string) {
    return this.service.removeProject(id);
  }
}
