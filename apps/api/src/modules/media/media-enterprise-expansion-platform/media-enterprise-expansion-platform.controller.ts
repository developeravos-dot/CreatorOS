import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { MediaEnterpriseExpansionPlatformService } from './media-enterprise-expansion-platform.service';
import {
  AssetStage,
  MediaAssetInput,
} from './media-enterprise-expansion.types';

@Controller('media/enterprise-expansion')
export class MediaEnterpriseExpansionPlatformController {
  constructor(
    private readonly platform: MediaEnterpriseExpansionPlatformService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return this.platform.capabilities();
  }

  @Get('dashboard')
  dashboard() {
    return this.platform.dashboard();
  }

  @Get('assets')
  list() {
    return this.platform.list();
  }

  @Get('assets/:id')
  get(@Param('id') id: string) {
    return this.platform.get(id);
  }

  @Post('assets')
  create(@Body() input: MediaAssetInput) {
    return this.platform.create(input);
  }

  @Post('assets/:id/approve')
  approve(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.platform.approve(id, body.approvedBy);
  }

  @Patch('assets/:id/stage')
  advance(
    @Param('id') id: string,
    @Body() body: { stage: AssetStage; actor: string },
  ) {
    return this.platform.advance(id, body.stage, body.actor);
  }

  @Post('assets/:id/partners')
  activatePartner(
    @Param('id') id: string,
    @Body() body: { partner: string; actor: string },
  ) {
    return this.platform.activatePartner(id, body.partner, body.actor);
  }

  @Post('assets/:id/revenue')
  recordRevenue(
    @Param('id') id: string,
    @Body() body: { amount: number; actor: string },
  ) {
    return this.platform.recordRevenue(id, body.amount, body.actor);
  }
}