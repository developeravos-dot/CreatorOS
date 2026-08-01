import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateEnterpriseMediaProjectInput } from './media-enterprise.types';
import { MediaEnterprisePlatformService } from './media-enterprise-platform.service';

@Controller('media/enterprise')
export class MediaEnterprisePlatformController {
  constructor(private readonly service: MediaEnterprisePlatformService) {}

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

  @Get('projects/:id/audit')
  getAuditTrail(@Param('id') id: string) {
    return this.service.getAuditTrail(id);
  }

  @Post('projects')
  createProject(@Body() input: CreateEnterpriseMediaProjectInput) {
    return this.service.createProject(input);
  }

  @Post('projects/:id/approve')
  approveProject(@Param('id') id: string, @Body('approvedBy') approvedBy?: string) {
    return this.service.approveProject(id, approvedBy);
  }

  @Post('projects/:id/production/start')
  startProduction(@Param('id') id: string) {
    return this.service.startProduction(id);
  }

  @Patch('projects/:id/production/progress')
  updateProgress(@Param('id') id: string, @Body('progress') progress: number) {
    return this.service.updateProgress(id, progress);
  }

  @Post('projects/:id/publish')
  publishProject(@Param('id') id: string) {
    return this.service.publishProject(id);
  }

  @Post('projects/:id/pause')
  pauseProject(@Param('id') id: string) {
    return this.service.pauseProject(id);
  }

  @Post('projects/:id/archive')
  archiveProject(@Param('id') id: string) {
    return this.service.archiveProject(id);
  }
}
