import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  CreateMediaAudienceProfileDto,
  CreateMediaCompetitorDto,
  CreateMediaOpportunityDto,
  CreateMediaResearchDto,
  CreateMediaTrendDto,
} from './media-research.dto';

import {
  MediaResearchService,
} from './media-research.service';

@Controller({
  path: 'avos/media/research',
  version: '1'
})
export class MediaResearchController {
  constructor(
    private readonly service:
      MediaResearchService,
  ) {}

  @Get('status')
  status() {
    return this.service.status();
  }

  @Post('records')
  createResearch(
    @Body()
    dto: CreateMediaResearchDto,
  ) {
    return this.service.createResearch(dto);
  }

  @Get('records')
  listResearch(
    @Query('projectId')
    projectId?: string,
  ) {
    return this.service.listResearch(
      projectId,
    );
  }

  @Post('trends')
  createTrend(
    @Body()
    dto: CreateMediaTrendDto,
  ) {
    return this.service.createTrend(dto);
  }

  @Get('trends')
  listTrends(
    @Query('projectId')
    projectId?: string,
  ) {
    return this.service.listTrends(
      projectId,
    );
  }

  @Post('competitors')
  createCompetitor(
    @Body()
    dto: CreateMediaCompetitorDto,
  ) {
    return this.service.createCompetitor(
      dto,
    );
  }

  @Get('competitors')
  listCompetitors(
    @Query('projectId')
    projectId?: string,
  ) {
    return this.service.listCompetitors(
      projectId,
    );
  }

  @Post('audiences')
  createAudience(
    @Body()
    dto: CreateMediaAudienceProfileDto,
  ) {
    return this.service.createAudience(dto);
  }

  @Get('audiences')
  listAudiences(
    @Query('projectId')
    projectId?: string,
  ) {
    return this.service.listAudiences(
      projectId,
    );
  }

  @Post('opportunities')
  createOpportunity(
    @Body()
    dto: CreateMediaOpportunityDto,
  ) {
    return this.service.createOpportunity(
      dto,
    );
  }

  @Get('opportunities')
  listOpportunities(
    @Query('projectId')
    projectId?: string,
  ) {
    return this.service.listOpportunities(
      projectId,
    );
  }

  @Patch('opportunities/:id/approve')
  approveOpportunity(
    @Param('id')
    id: string,
  ) {
    return this.service.approveOpportunity(
      id,
    );
  }
}

