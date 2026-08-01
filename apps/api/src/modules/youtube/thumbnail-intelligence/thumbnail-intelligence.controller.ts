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
  CreateOptimizationCandidateInput,
  OptimizationPriority,
  OptimizationStatus,
  UpdateOptimizationCandidateInput,
} from '../optimization-core/optimization-engine.base';

import {
  ThumbnailIntelligenceService,
} from './thumbnail-intelligence.service';

@Controller('youtube/thumbnail-intelligence')
export class ThumbnailIntelligenceController {
  constructor(
    private readonly service: ThumbnailIntelligenceService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('rules')
  getRules() {
    return this.service.getRules();
  }

  @Get('candidates')
  listCandidates(
    @Query('status') status?: OptimizationStatus,
    @Query('priority') priority?: OptimizationPriority,
    @Query('search') search?: string,
    @Query('minimumScore') minimumScore?: string,
  ) {
    return this.service.listCandidates({
      status,
      priority,
      search,
      minimumScore:
        minimumScore !== undefined
          ? Number(minimumScore)
          : undefined,
    });
  }

  @Get('candidates/top')
  getTopCandidates(
    @Query('limit') limit?: string,
  ) {
    return this.service.getTopCandidates(
      Number(limit ?? 10),
    );
  }

  @Get('candidates/:id')
  getCandidate(@Param('id') id: string) {
    return this.service.getCandidate(id);
  }

  @Post('candidates')
  createCandidate(
    @Body() input: CreateOptimizationCandidateInput,
  ) {
    return this.service.createCandidate(input);
  }

  @Patch('candidates/:id')
  updateCandidate(
    @Param('id') id: string,
    @Body() input: UpdateOptimizationCandidateInput,
  ) {
    return this.service.updateCandidate(id, input);
  }

  @Post('candidates/:id/optimize')
  optimizeCandidate(@Param('id') id: string) {
    return this.service.optimizeCandidate(id);
  }

  @Post('candidates/:id/approve')
  approveCandidate(@Param('id') id: string) {
    return this.service.approveCandidate(id);
  }

  @Post('candidates/:id/publish')
  publishCandidate(@Param('id') id: string) {
    return this.service.publishCandidate(id);
  }

  @Post('candidates/:id/reject')
  rejectCandidate(@Param('id') id: string) {
    return this.service.rejectCandidate(id);
  }

  @Delete('candidates/:id')
  removeCandidate(@Param('id') id: string) {
    return this.service.removeCandidate(id);
  }

  @Post('evaluate')
  evaluate(@Body('content') content: string) {
    return this.service.evaluate(content);
  }

  @Post('compare')
  compare(@Body('contents') contents: string[]) {
    return this.service.compare(contents);
  }
}
