import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MediaGalaxyService } from './media-galaxy.service';
import { CreateGalaxyProjectInput } from './media-galaxy.types';

@Controller('media/galaxy')
export class MediaGalaxyController {
  constructor(private readonly service: MediaGalaxyService) {}

  @Get('capabilities') capabilities() { return this.service.capabilities(); }
  @Get('dashboard') dashboard() { return this.service.dashboard(); }
  @Get('projects') listProjects() { return this.service.listProjects(); }
  @Get('projects/:id') getProject(@Param('id') id: string) { return this.service.getProject(id); }
  @Get('projects/:id/memory') getMemory(@Param('id') id: string) { return this.service.getMemory(id); }
  @Get('projects/:id/decisions') decisions(@Param('id') id: string) { return this.service.listDecisions(id); }
  @Post('projects') create(@Body() input: CreateGalaxyProjectInput) { return this.service.createProject(input); }
  @Post('projects/:id/approve') approve(@Param('id') id: string, @Body('approvedBy') approvedBy?: string) { return this.service.approveProject(id, approvedBy); }
  @Post('projects/:id/activate') activate(@Param('id') id: string) { return this.service.activateProject(id); }
  @Post('projects/:id/pause') pause(@Param('id') id: string) { return this.service.pauseProject(id); }
  @Post('projects/:id/decisions') createDecision(@Param('id') id: string, @Body('subject') subject: string, @Body('evidence') evidence?: Record<string, unknown>) { return this.service.createDecision(id, subject, evidence ?? {}); }
  @Post('decisions/:id/approve') approveDecision(@Param('id') id: string) { return this.service.approveDecision(id); }
}
