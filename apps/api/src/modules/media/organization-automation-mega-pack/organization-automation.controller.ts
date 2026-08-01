import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { OrganizationAutomationOrchestratorService } from './organization-automation-orchestrator.service';
import { OrganizationBrief } from './organization-automation.types';

@Controller('media/organization-automation')
export class OrganizationAutomationController {
  constructor(
    private readonly orchestrator:
      OrganizationAutomationOrchestratorService,
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
  create(@Body() body: OrganizationBrief) {
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
    return this.orchestrator.approveProgram(
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

  @Post('programs/:id/workflows')
  createWorkflow(
    @Param('id') id: string,
    @Body()
    body: {
      name: string;
      objective: string;
      priority: number;
      actor: string;
    },
  ) {
    return this.orchestrator.createWorkflow(
      id,
      body.name,
      body.objective,
      body.priority,
      body.actor,
    );
  }

  @Post('programs/:id/workflows/:workflowId/start')
  startWorkflow(
    @Param('id') id: string,
    @Param('workflowId') workflowId: string,
    @Body() body: { actor: string },
  ) {
    return this.orchestrator.startWorkflow(
      id,
      workflowId,
      body.actor,
    );
  }

  @Post(
    'programs/:id/workflows/:workflowId/steps/:stepId/complete',
  )
  completeWorkflowStep(
    @Param('id') id: string,
    @Param('workflowId') workflowId: string,
    @Param('stepId') stepId: string,
    @Body()
    body: {
      output: Record<string, unknown>;
      actor: string;
    },
  ) {
    return this.orchestrator.completeWorkflowStep(
      id,
      workflowId,
      stepId,
      body.output,
      body.actor,
    );
  }

  @Post(
    'programs/:id/workflows/:workflowId/steps/:stepId/human-decision',
  )
  approveWorkflowHumanStep(
    @Param('id') id: string,
    @Param('workflowId') workflowId: string,
    @Param('stepId') stepId: string,
    @Body()
    body: {
      approved: boolean;
      decidedBy: string;
    },
  ) {
    return this.orchestrator.approveWorkflowHumanStep(
      id,
      workflowId,
      stepId,
      body.approved,
      body.decidedBy,
    );
  }

  @Post('programs/:id/approvals')
  requestApproval(
    @Param('id') id: string,
    @Body()
    body: {
      category: string;
      targetId: string;
      requestedBy: string;
      reason: string;
    },
  ) {
    return this.orchestrator.requestApproval(
      id,
      body.category,
      body.targetId,
      body.requestedBy,
      body.reason,
    );
  }

  @Post('programs/:id/approvals/:approvalId/decision')
  decideApproval(
    @Param('id') id: string,
    @Param('approvalId') approvalId: string,
    @Body()
    body: {
      approved: boolean;
      decidedBy: string;
    },
  ) {
    return this.orchestrator.decideApproval(
      id,
      approvalId,
      body.approved,
      body.decidedBy,
    );
  }

  @Post('programs/:id/automation-rules/:ruleId/enable')
  enableAutomationRule(
    @Param('id') id: string,
    @Param('ruleId') ruleId: string,
    @Body()
    body: {
      humanApproved: boolean;
      actor: string;
    },
  ) {
    return this.orchestrator.enableAutomationRule(
      id,
      ruleId,
      body.humanApproved,
      body.actor,
    );
  }

  @Post('programs/:id/automation-rules/:ruleId/evaluate')
  evaluateAutomationRule(
    @Param('id') id: string,
    @Param('ruleId') ruleId: string,
    @Body() body: { context: Record<string, unknown> },
  ) {
    return this.orchestrator.evaluateAutomationRule(
      id,
      ruleId,
      body.context,
    );
  }
}