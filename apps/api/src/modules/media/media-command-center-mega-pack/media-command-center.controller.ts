import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { MediaCommandCenterOrchestratorService } from './media-command-center-orchestrator.service';
import { CommandCenterBrief } from './media-command-center.types';

@Controller('media/command-center')
export class MediaCommandCenterController {
  constructor(
    private readonly orchestrator:
      MediaCommandCenterOrchestratorService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return this.orchestrator.capabilities();
  }

  @Get('dashboard')
  dashboard() {
    return this.orchestrator.dashboard();
  }

  @Get('programs/:id/dashboard')
  programDashboard(@Param('id') id: string) {
    return this.orchestrator.dashboard(id);
  }

  @Post('programs')
  create(@Body() body: CommandCenterBrief) {
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
    return this.orchestrator.approve(
      id,
      body.approvedBy,
    );
  }

  @Post('programs/:id/activate')
  activate(
    @Param('id') id: string,
    @Body() body: { actor: string },
  ) {
    return this.orchestrator.activate(
      id,
      body.actor,
    );
  }

  @Post('programs/:id/system-health')
  updateSystemHealth(
    @Param('id') id: string,
    @Body()
    body: {
      system: string;
      metrics: Record<string, number>;
      actor: string;
    },
  ) {
    return this.orchestrator.updateSystemHealth(
      id,
      body.system,
      body.metrics,
      body.actor,
    );
  }

  @Post('programs/:id/commands')
  createCommand(
    @Param('id') id: string,
    @Body()
    body: {
      command: string;
      targetSystem: string;
      payload: Record<string, unknown>;
      riskLevel: 'low' | 'medium' | 'high' | 'critical';
      requestedBy: string;
    },
  ) {
    return this.orchestrator.createCommand(
      id,
      body.command,
      body.targetSystem,
      body.payload,
      body.riskLevel,
      body.requestedBy,
    );
  }

  @Post('programs/:id/commands/:commandId/approve')
  approveCommand(
    @Param('id') id: string,
    @Param('commandId') commandId: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.orchestrator.approveCommand(
      id,
      commandId,
      body.approvedBy,
    );
  }

  @Post('programs/:id/commands/:commandId/execute')
  executeCommand(
    @Param('id') id: string,
    @Param('commandId') commandId: string,
    @Body() body: { actor: string },
  ) {
    return this.orchestrator.executeCommand(
      id,
      commandId,
      body.actor,
    );
  }

  @Post('programs/:id/decisions')
  createDecision(
    @Param('id') id: string,
    @Body()
    body: {
      category: string;
      question: string;
      options: string[];
      recommendation: string;
      confidence: number;
      actor: string;
    },
  ) {
    return this.orchestrator.createDecision(
      id,
      body.category,
      body.question,
      body.options,
      body.recommendation,
      body.confidence,
      body.actor,
    );
  }

  @Post('programs/:id/decisions/:decisionId/decide')
  decide(
    @Param('id') id: string,
    @Param('decisionId') decisionId: string,
    @Body()
    body: {
      decision: string;
      decidedBy: string;
    },
  ) {
    return this.orchestrator.decide(
      id,
      decisionId,
      body.decision,
      body.decidedBy,
    );
  }

  @Post('programs/:id/alerts/:alertId/acknowledge')
  acknowledgeAlert(
    @Param('id') id: string,
    @Param('alertId') alertId: string,
    @Body() body: { acknowledgedBy: string },
  ) {
    return this.orchestrator.acknowledgeAlert(
      id,
      alertId,
      body.acknowledgedBy,
    );
  }
}