import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import {
  CreateMediaChannelDto,
  CreateMediaChannelLanguagesDto,
  CreateMediaContentIdeaDto,
  CreateMediaProjectDto,
  DecideMediaApprovalDto,
} from './media-ecosystem.dto';

import {
  MediaEcosystemService,
} from './media-ecosystem.service';

@Controller('avos/media')
export class MediaEcosystemController {
  constructor(
    private readonly media:
      MediaEcosystemService,
  ) {}

  @Get('status')
  getStatus() {
    return this.media.getStatus();
  }

  @Post('projects')
  createProject(
    @Body()
    dto: CreateMediaProjectDto,
  ) {
    return this.media.createProject(dto);
  }

  @Get('projects')
  listProjects() {
    return this.media.listProjects();
  }

  @Get('projects/:id')
  getProject(
    @Param('id')
    id: string,
  ) {
    return this.media.getProject(id);
  }

  @Post('projects/:projectId/channels')
  createChannel(
    @Param('projectId')
    projectId: string,

    @Body()
    dto: CreateMediaChannelDto,
  ) {
    return this.media.createChannel(
      projectId,
      dto,
    );
  }

  @Get('projects/:projectId/channels')
  listProjectChannels(
    @Param('projectId')
    projectId: string,
  ) {
    return this.media
      .listProjectChannels(projectId);
  }

  @Get('channels/:channelId/family')
  getChannelFamily(
    @Param('channelId')
    channelId: string,
  ) {
    return this.media
      .getChannelFamily(channelId);
  }

  @Post('channels/:channelId/languages')
  addChannelLanguages(
    @Param('channelId')
    channelId: string,

    @Body()
    dto: CreateMediaChannelLanguagesDto,
  ) {
    return this.media
      .addChannelLanguages(
        channelId,
        dto,
      );
  }

  @Post('ideas')
  createIdea(
    @Body()
    dto: CreateMediaContentIdeaDto,
  ) {
    return this.media.createIdea(dto);
  }

  @Get('ideas')
  listIdeas(
    @Query('projectId')
    projectId?: string,
  ) {
    return this.media
      .listIdeas(projectId);
  }

  @Post('ideas/:id/approve')
  approveIdea(
    @Param('id')
    id: string,
  ) {
    return this.media.approveIdea(id);
  }

  @Get('approvals')
  listApprovals() {
    return this.media
      .listApprovals();
  }

  @Post('approvals/:id/approve')
  approveRequest(
    @Param('id')
    id: string,

    @Body()
    dto: DecideMediaApprovalDto,
  ) {
    return this.media
      .decideApproval(
        id,
        'approved',
        dto?.notes,
      );
  }

  @Post('approvals/:id/reject')
  rejectRequest(
    @Param('id')
    id: string,

    @Body()
    dto: DecideMediaApprovalDto,
  ) {
    return this.media
      .decideApproval(
        id,
        'rejected',
        dto?.notes,
      );
  }

  @Get('events')
  listEvents(
    @Query('limit')
    limit?: string,
  ) {
    const parsedLimit =
      limit === undefined
        ? 100
        : Number.parseInt(limit, 10);

    return this.media.listEvents(
      Number.isNaN(parsedLimit)
        ? 100
        : parsedLimit,
    );
  }
}