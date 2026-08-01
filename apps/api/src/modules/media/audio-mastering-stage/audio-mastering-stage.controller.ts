import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { AudioMasteringStageService } from './audio-mastering-stage.service';

@Controller('media/ultra-ecosystem/audio-mastering')
export class AudioMasteringStageController {
  constructor(
    private readonly service: AudioMasteringStageService,
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
  listProjects() {
    return this.service.listProjects();
  }

  @Post('projects')
  createProject(
    @Body() input: {
      name: string;
      description?: string;
      owner: string;
    },
  ) {
    return this.service.createProject(input);
  }

  @Get('projects/:id')
  getProject(@Param('id') id: string) {
    return this.service.getProject(id);
  }

  @Post('projects/:id/start')
  startProject(@Param('id') id: string) {
    return this.service.startProject(id);
  }

  @Post('projects/:id/execute')
  execute(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.executeManagedStage(
      id,
      input as never,
    );
  }

  @Post('projects/:id/human-approve')
  approve(@Param('id') id: string) {
    return this.service.approveStage(id);
  }

  @Delete('projects/:id')
  remove(@Param('id') id: string) {
    return this.service.removeProject(id);
  }
}
