import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MediaEmpireCommandService } from './media-empire-command.service';
import { CreateMediaEmpireProjectInput } from './media-empire-command.types';

@Controller('media/empire')
export class MediaEmpireCommandController {
  constructor(private readonly service: MediaEmpireCommandService) {}

  @Get('dashboard')
  getDashboard() {
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

  @Post('projects')
  createProject(@Body() input: CreateMediaEmpireProjectInput) {
    return this.service.createProject(input);
  }

  @Post('projects/:id/approve')
  approveProject(@Param('id') id: string, @Body('approvedBy') approvedBy?: string) {
    return this.service.approveProject(id, approvedBy);
  }

  @Post('projects/:id/activate')
  activateProject(@Param('id') id: string) {
    return this.service.activateProject(id);
  }

  @Post('projects/:id/pause')
  pauseProject(@Param('id') id: string) {
    return this.service.pauseProject(id);
  }
}
