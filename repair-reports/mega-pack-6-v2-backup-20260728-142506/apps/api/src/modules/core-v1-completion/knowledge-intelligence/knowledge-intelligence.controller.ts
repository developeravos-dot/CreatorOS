import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../security/permissions.decorator';
import { Permissions } from '../security/permissions';
import { KnowledgeInsightStatus } from '../../../generated/prisma/enums';
import { CreateKnowledgeEvidenceDto, CreateKnowledgeInsightDto, CreateKnowledgeSourceDto, KnowledgeGraphQueryDto, TransitionKnowledgeInsightDto, UpdateKnowledgeSourceDto } from './dto/knowledge-intelligence.dto';
import { KnowledgeIntelligenceService } from './knowledge-intelligence.service';

@ApiTags('Knowledge Intelligence')
@ApiBearerAuth()
@Controller('knowledge-intelligence')
export class KnowledgeIntelligenceController {
  constructor(private readonly knowledge: KnowledgeIntelligenceService) {}

  @Get('dashboard') @RequirePermissions(Permissions.KnowledgeDashboardRead) dashboard() { return this.knowledge.dashboard(); }
  @Get('graph') @RequirePermissions(Permissions.KnowledgeRead) graph(@Query() query: KnowledgeGraphQueryDto) { return this.knowledge.graph(query); }
  @Get('graph/:id/traverse') @RequirePermissions(Permissions.KnowledgeRead) traverse(@Param('id') id: string, @Query('depth') depth?: string) { return this.knowledge.traverse(id, depth ? Number(depth) : 1); }

  @Get('sources') @RequirePermissions(Permissions.KnowledgeProvenanceRead) sources() { return this.knowledge.listSources(); }
  @Post('sources') @RequirePermissions(Permissions.KnowledgeProvenanceWrite) createSource(@Body() body: CreateKnowledgeSourceDto) { return this.knowledge.createSource(body); }
  @Patch('sources/:id') @RequirePermissions(Permissions.KnowledgeProvenanceWrite) updateSource(@Param('id') id: string, @Body() body: UpdateKnowledgeSourceDto) { return this.knowledge.updateSource(id, body); }

  @Get('evidence') @RequirePermissions(Permissions.KnowledgeProvenanceRead) evidence(@Query('nodeId') nodeId?: string) { return this.knowledge.listEvidence(nodeId); }
  @Post('evidence') @RequirePermissions(Permissions.KnowledgeProvenanceWrite) createEvidence(@Body() body: CreateKnowledgeEvidenceDto) { return this.knowledge.createEvidence(body); }

  @Get('insights') @RequirePermissions(Permissions.KnowledgeInsightsRead) insights(@Query('status') status?: KnowledgeInsightStatus) { return this.knowledge.listInsights(status); }
  @Post('insights') @RequirePermissions(Permissions.KnowledgeInsightsWrite) createInsight(@Body() body: CreateKnowledgeInsightDto) { return this.knowledge.createInsight(body); }
  @Patch('insights/:id/review') @RequirePermissions(Permissions.KnowledgeInsightsApprove) reviewInsight(@Param('id') id: string, @Body() body: TransitionKnowledgeInsightDto) { return this.knowledge.transitionInsight(id, body); }
}
