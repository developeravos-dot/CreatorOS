import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AutonomousMediaOperationsService } from './autonomous-media-operations.service';
import { CreateAutonomousMediaProjectInput } from './autonomous-media-operations.types';
import { MediaExperimentService } from './media-experiment.service';

@Controller('media/autonomous')
export class AutonomousMediaOperationsController {
  constructor(
    private readonly service: AutonomousMediaOperationsService,
    private readonly experiments: MediaExperimentService,
  ) {}

  @Get('dashboard')
  dashboard() {
    return this.service.getDashboard();
  }

  @Get('projects')
  listProjects() {
    return this.service.listProjects();
  }

  @Get('projects/:id')
  getProject(@Param('id') id: string) {
    return this.service.getProject(id);
  }

  @Get('projects/:id/memory')
  getMemory(@Param('id') id: string) {
    return this.service.getProjectMemory(id);
  }

  @Get('projects/:id/experiments')
  listExperiments(@Param('id') id: string) {
    this.service.getProject(id);
    return this.experiments.list(id);
  }

  @Post('projects')
  createProject(@Body() input: CreateAutonomousMediaProjectInput) {
    return this.service.createProject(input);
  }

  @Post('projects/:id/approve')
  approveProject(@Param('id') id: string, @Body('approvedBy') approvedBy?: string) {
    return this.service.approveProject(id, approvedBy);
  }

  @Post('projects/:id/schedule')
  scheduleProject(@Param('id') id: string, @Body('nextRunAt') nextRunAt?: string) {
    return this.service.scheduleProject(id, nextRunAt);
  }

  @Post('projects/:id/run')
  runCycle(@Param('id') id: string) {
    return this.service.runCycle(id);
  }

  @Patch('projects/:id/performance')
  recordPerformance(@Param('id') id: string, @Body() metrics: Record<string, number>) {
    return this.service.recordPerformance(id, metrics);
  }

  @Post('projects/:id/experiments')
  createExperiment(
    @Param('id') id: string,
    @Body('hypothesis') hypothesis: string,
    @Body('variants') variants: string[],
    @Body('metric') metric: string,
  ) {
    return this.service.createExperiment(id, hypothesis, variants, metric);
  }

  @Post('experiments/:id/start')
  startExperiment(@Param('id') id: string) {
    return this.experiments.start(id);
  }

  @Post('experiments/:id/complete')
  completeExperiment(@Param('id') id: string, @Body('winner') winner: string) {
    return this.experiments.complete(id, winner);
  }

  @Post('projects/:id/pause')
  pauseProject(@Param('id') id: string) {
    return this.service.pauseProject(id);
  }

  @Post('projects/:id/complete')
  completeProject(@Param('id') id: string) {
    return this.service.completeProject(id);
  }
}
