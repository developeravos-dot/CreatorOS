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
  CreateMediaProductionInput,
  ProductionPriority,
  ProductionStatus,
  ProductionType,
  UpdateMediaProductionInput,
} from '../media-production-core/media-production-engine.base';

import {
  EditingVfxQualityEngineService,
} from './editing-vfx-quality-engine.service';

@Controller('media/editing-vfx-quality')
export class EditingVfxQualityEngineController {
  constructor(
    private readonly service: EditingVfxQualityEngineService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('records')
  listRecords(
    @Query('status')
    status?: ProductionStatus,
    @Query('priority')
    priority?: ProductionPriority,
    @Query('type')
    type?: ProductionType,
    @Query('category')
    category?: string,
    @Query('owner')
    owner?: string,
    @Query('platform')
    platform?: string,
    @Query('language')
    language?: string,
    @Query('projectId')
    projectId?: string,
    @Query('search')
    search?: string,
    @Query('humanApproved')
    humanApproved?: string,
  ) {
    return this.service.listRecords({
      status,
      priority,
      type,
      category,
      owner,
      platform,
      language,
      projectId,
      search,
      humanApproved:
        humanApproved === undefined
          ? undefined
          : humanApproved === 'true',
    });
  }

  @Get('records/top')
  getTopRecords(
    @Query('limit') limit?: string,
  ) {
    return this.service.getTopRecords(
      Number(limit ?? 10),
    );
  }

  @Get('records/:id')
  getRecord(@Param('id') id: string) {
    return this.service.getRecord(id);
  }

  @Get('records/:id/script-blueprint')
  generateScriptBlueprint(
    @Param('id') id: string,
  ) {
    return this.service.generateScriptBlueprint(
      id,
    );
  }

  @Get('records/:id/storyboard-blueprint')
  generateStoryboardBlueprint(
    @Param('id') id: string,
  ) {
    return this.service.generateStoryboardBlueprint(
      id,
    );
  }

  @Get('records/:id/visual-production-plan')
  generateVisualProductionPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateVisualProductionPlan(
      id,
    );
  }

  @Get('records/:id/audio-production-plan')
  generateAudioProductionPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateAudioProductionPlan(
      id,
    );
  }

  @Get('records/:id/editing-plan')
  generateEditingPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateEditingPlan(id);
  }

  @Get('records/:id/quality-assessment')
  runQualityAssessment(
    @Param('id') id: string,
  ) {
    return this.service.runQualityAssessment(id);
  }

  @Get('records/:id/timeline')
  getProductionTimeline(
    @Param('id') id: string,
  ) {
    return this.service.getProductionTimeline(id);
  }

  @Post('records')
  createRecord(
    @Body() input: CreateMediaProductionInput,
  ) {
    return this.service.createRecord(input);
  }

  @Patch('records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() input: UpdateMediaProductionInput,
  ) {
    return this.service.updateRecord(id, input);
  }

  @Post('records/:id/pre-production')
  startPreProduction(
    @Param('id') id: string,
  ) {
    return this.service.startPreProduction(id);
  }

  @Post('records/:id/script-development')
  startScriptDevelopment(
    @Param('id') id: string,
  ) {
    return this.service.startScriptDevelopment(
      id,
    );
  }

  @Post('records/:id/storyboarding')
  startStoryboarding(
    @Param('id') id: string,
  ) {
    return this.service.startStoryboarding(id);
  }

  @Post('records/:id/asset-production')
  startAssetProduction(
    @Param('id') id: string,
  ) {
    return this.service.startAssetProduction(id);
  }

  @Post('records/:id/audio-production')
  startAudioProduction(
    @Param('id') id: string,
  ) {
    return this.service.startAudioProduction(id);
  }

  @Post('records/:id/editing')
  startEditing(@Param('id') id: string) {
    return this.service.startEditing(id);
  }

  @Post('records/:id/quality-review')
  startQualityReview(
    @Param('id') id: string,
  ) {
    return this.service.startQualityReview(id);
  }

  @Post('records/:id/human-review')
  submitForHumanReview(
    @Param('id') id: string,
  ) {
    return this.service.submitForHumanReview(id);
  }

  @Post('records/:id/human-approve')
  approveByHuman(@Param('id') id: string) {
    return this.service.approveByHuman(id);
  }

  @Post('records/:id/human-reject')
  rejectByHuman(@Param('id') id: string) {
    return this.service.rejectByHuman(id);
  }

  @Post('records/:id/render')
  startRendering(@Param('id') id: string) {
    return this.service.startRendering(id);
  }

  @Post('records/:id/complete')
  completeProduction(
    @Param('id') id: string,
  ) {
    return this.service.completeProduction(id);
  }

  @Post('records/:id/archive')
  archiveRecord(@Param('id') id: string) {
    return this.service.archiveRecord(id);
  }

  @Post('records/:id/scenes')
  addScene(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.addScene(id, input);
  }

  @Patch('records/:id/scenes/:sceneId')
  updateScene(
    @Param('id') id: string,
    @Param('sceneId') sceneId: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.updateScene(
      id,
      sceneId,
      input,
    );
  }

  @Delete('records/:id/scenes/:sceneId')
  removeScene(
    @Param('id') id: string,
    @Param('sceneId') sceneId: string,
  ) {
    return this.service.removeScene(
      id,
      sceneId,
    );
  }

  @Post('records/:id/issues')
  addIssue(
    @Param('id') id: string,
    @Body('issue') issue: string,
  ) {
    return this.service.addIssue(id, issue);
  }

  @Post('records/:id/assets/:assetType')
  addAsset(
    @Param('id') id: string,
    @Param('assetType')
    assetType:
      | 'visual'
      | 'audio'
      | 'music'
      | 'voice'
      | 'editing',
    @Body('asset') asset: string,
  ) {
    return this.service.addAsset(
      id,
      assetType,
      asset,
    );
  }

  @Delete('records/:id')
  removeRecord(@Param('id') id: string) {
    return this.service.removeRecord(id);
  }
}
