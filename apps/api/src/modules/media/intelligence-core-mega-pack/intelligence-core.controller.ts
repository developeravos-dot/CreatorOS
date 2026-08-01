import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { IntelligenceCoreOrchestratorService } from './intelligence-core-orchestrator.service';
import { IntelligenceCoreBrief } from './intelligence-core.types';

@Controller('media/intelligence-core')
export class IntelligenceCoreController {
  constructor(
    private readonly orchestrator: IntelligenceCoreOrchestratorService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return this.orchestrator.capabilities();
  }

  @Get('dashboard')
  dashboard() {
    return this.orchestrator.dashboard();
  }

  @Post('programs')
  create(@Body() body: IntelligenceCoreBrief) {
    return this.orchestrator.create(body);
  }

  @Get('programs')
  list() {
    return this.orchestrator.list();
  }

  @Get('programs/:id')
  get(@Param('id') id: string) {
    return this.orchestrator.get(id);
  }

  @Post('programs/:id/approve')
  approve(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.orchestrator.approve(id, body.approvedBy);
  }

  @Post('programs/:id/activate')
  activate(
    @Param('id') id: string,
    @Body() body: { actor: string },
  ) {
    return this.orchestrator.activate(id, body.actor);
  }

  @Post('programs/:id/analytics')
  recordAnalytics(
    @Param('id') id: string,
    @Body() body: {
      updates: Record<string, number>;
      actor: string;
    },
  ) {
    return this.orchestrator.recordAnalytics(
      id,
      body.updates,
      body.actor,
    );
  }

  @Post('programs/:id/learnings')
  learn(
    @Param('id') id: string,
    @Body() body: {
      source: string;
      observation: string;
      confidence: number;
      actor: string;
    },
  ) {
    return this.orchestrator.learn(
      id,
      body.source,
      body.observation,
      body.confidence,
      body.actor,
    );
  }

  @Post('programs/:id/memory')
  remember(
    @Param('id') id: string,
    @Body() body: {
      category: string;
      summary: string;
      source: string;
      tags: string[];
      importance: number;
      actor: string;
    },
  ) {
    return this.orchestrator.remember(
      id,
      body.category,
      body.summary,
      body.source,
      body.tags,
      body.importance,
      body.actor,
    );
  }

  @Get('programs/:id/memory/search')
  searchMemory(
    @Param('id') id: string,
    @Query('q') query: string,
  ) {
    return this.orchestrator.searchMemory(id, query ?? '');
  }

  @Post('programs/:id/improvements/:improvementId/approve')
  approveImprovement(
    @Param('id') id: string,
    @Param('improvementId') improvementId: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.orchestrator.approveImprovement(
      id,
      improvementId,
      body.approvedBy,
    );
  }
}