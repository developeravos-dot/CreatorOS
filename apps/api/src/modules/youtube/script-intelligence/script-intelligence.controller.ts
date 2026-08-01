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
  CreateProductionRecordInput,
  ProductionAssetType,
  ProductionPriority,
  ProductionStatus,
  UpdateProductionRecordInput,
} from '../content-production-core/content-production-engine.base';

import {
  ScriptIntelligenceService,
} from './script-intelligence.service';

@Controller('youtube/script-intelligence')
export class ScriptIntelligenceController {
  constructor(
    private readonly service: ScriptIntelligenceService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('records')
  listRecords(
    @Query('status') status?: ProductionStatus,
    @Query('priority') priority?: ProductionPriority,
    @Query('category') category?: string,
    @Query('assetType') assetType?: ProductionAssetType,
    @Query('language') language?: string,
    @Query('search') search?: string,
    @Query('minimumScore') minimumScore?: string,
  ) {
    return this.service.listRecords({
      status,
      priority,
      category,
      assetType,
      language,
      search,
      minimumScore:
        minimumScore !== undefined
          ? Number(minimumScore)
          : undefined,
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

  @Get('records/:id/recommendations')
  generateRecommendations(
    @Param('id') id: string,
  ) {
    return this.service.generateRecommendations(id);
  }

  @Post('records')
  createRecord(
    @Body() input: CreateProductionRecordInput,
  ) {
    return this.service.createRecord(input);
  }

  @Patch('records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() input: UpdateProductionRecordInput,
  ) {
    return this.service.updateRecord(id, input);
  }

  @Post('records/:id/draft')
  moveToDraft(@Param('id') id: string) {
    return this.service.moveToDraft(id);
  }

  @Post('records/:id/start')
  startProduction(@Param('id') id: string) {
    return this.service.startProduction(id);
  }

  @Post('records/:id/review')
  sendToReview(@Param('id') id: string) {
    return this.service.sendToReview(id);
  }

  @Post('records/:id/ready')
  markReady(@Param('id') id: string) {
    return this.service.markReady(id);
  }

  @Post('records/:id/publish')
  publishRecord(@Param('id') id: string) {
    return this.service.publishRecord(id);
  }

  @Post('records/:id/cancel')
  cancelRecord(@Param('id') id: string) {
    return this.service.cancelRecord(id);
  }

  @Post('records/:id/progress')
  updateProgress(
    @Param('id') id: string,
    @Body('progress') progress: number,
  ) {
    return this.service.updateProgress(
      id,
      progress,
    );
  }

  @Post('records/:id/file')
  attachFile(
    @Param('id') id: string,
    @Body('fileUrl') fileUrl: string,
  ) {
    return this.service.attachFile(
      id,
      fileUrl,
    );
  }

  @Post('outline')
  generateOutline(
    @Body('topic') topic: string,
    @Body('sections') sections?: number,
  ) {
    return this.service.generateOutline(
      topic,
      sections,
    );
  }

  @Post('estimate')
  estimateProduction(
    @Body('words') words: number,
    @Body('wordsPerMinute')
    wordsPerMinute?: number,
  ) {
    return this.service.estimateProduction(
      words,
      wordsPerMinute,
    );
  }

  @Delete('records/:id')
  removeRecord(@Param('id') id: string) {
    return this.service.removeRecord(id);
  }
}
