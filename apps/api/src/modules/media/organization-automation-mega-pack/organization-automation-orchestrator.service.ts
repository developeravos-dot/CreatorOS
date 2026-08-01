import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SpecialistAgentRegistryService } from './agents/specialist-agent-registry.service';
import { HumanApprovalService } from './approval/human-approval.service';
import { AutomationRuleEngineService } from './automation/automation-rule-engine.service';
import {
  OrganizationAutomationProgram,
  OrganizationBrief,
} from './organization-automation.types';
import { OperationalLedgerService } from './operations/operational-ledger.service';
import { OrganizationAutomationQualityService } from './quality/organization-automation-quality.service';
import { DigitalTeamBuilderService } from './teams/digital-team-builder.service';
import { WorkflowOrchestrationService } from './workflow/workflow-orchestration.service';

@Injectable()
export class OrganizationAutomationOrchestratorService {
  private readonly programs =
    new Map<string, OrganizationAutomationProgram>();

  constructor(
    private readonly agents: SpecialistAgentRegistryService,
    private readonly teams: DigitalTeamBuilderService,
    private readonly workflows: WorkflowOrchestrationService,
    private readonly automation: AutomationRuleEngineService,
    private readonly approvals: HumanApprovalService,
    private readonly ledger: OperationalLedgerService,
    private readonly quality: OrganizationAutomationQualityService,
  ) {}

  capabilities() {
    return {
      name: 'AVOS Organization & Automation Mega Pack',
      version: 'OA-MEGA-1.0.0',
      systems: [
        'Specialist Agent Registry',
        'Digital Team Builder',
        'Workflow Orchestration Engine',
        'Automation Rule Engine',
        'Human Approval System',
        'Operational Event Ledger',
      ],
      governance: [
        'human-final-authority',
        'specialist-agent-teams',
        'approval-before-high-risk-action',
        'workflow-auditability',
        'rollback-ready-automation',
      ],
    };
  }

  create(brief: OrganizationBrief) {
    const now = new Date().toISOString();
    const agents = this.agents.build(brief);
    const teams = this.teams.build(brief, agents);
    const workflows =
      this.workflows.createDefaultWorkflows(brief);
    const automationRules = this.automation.build(brief);
    const creationEvent = this.ledger.record(
      'Organization Automation Orchestrator',
      'organization-created',
    );

    const program: OrganizationAutomationProgram = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      status: 'awaiting-human-approval',
      brief: {
        ...brief,
        protectedPrinciples: [
          'human-final-authority',
          'auditable-automation',
          'specialist-team-collaboration',
          ...(brief.protectedPrinciples ?? []),
        ],
      },
      agents,
      teams,
      workflows,
      automationRules,
      approvals: [],
      events: [creationEvent],
      quality: {
        scores: {},
        failures: [],
        approved: false,
      },
      governance: {
        humanApproved: false,
        auditTrail: [creationEvent],
      },
    };

    program.quality = this.quality.evaluate(program);
    this.programs.set(program.id, program);
    return program;
  }

  list() {
    return [...this.programs.values()];
  }

  get(id: string) {
    const program = this.programs.get(id);

    if (!program) {
      throw new NotFoundException(
        `Organization Automation program not found: ${id}`,
      );
    }

    return program;
  }

  approveProgram(id: string, approvedBy: string) {
    const program = this.get(id);
    const now = new Date().toISOString();
    const event = this.ledger.record(
      approvedBy,
      'program-human-approved',
      program.id,
    );

    program.status = 'approved';
    program.updatedAt = now;
    program.governance.humanApproved = true;
    program.governance.approvedBy = approvedBy;
    program.governance.approvedAt = now;
    program.events.push(event);
    program.governance.auditTrail.push(event);
    program.quality = this.quality.evaluate(program);

    return program;
  }

  activate(id: string, actor: string) {
    const program = this.get(id);

    if (
      !program.governance.humanApproved ||
      !program.quality.approved
    ) {
      throw new Error(
        'Human approval and all organization quality gates are required.',
      );
    }

    const event = this.ledger.record(
      actor,
      'organization-activated',
      program.id,
    );

    program.status = 'active';
    program.updatedAt = event.at;
    program.events.push(event);
    program.governance.auditTrail.push(event);

    return program;
  }

  createWorkflow(
    id: string,
    name: string,
    objective: string,
    priority: number,
    actor: string,
  ) {
    const program = this.get(id);
    const workflow = this.workflows.create(
      name,
      objective,
      priority,
    );
    const team = program.teams[0];

    if (team) {
      workflow.assignedTeamId = team.id;
    }

    program.workflows.push(workflow);

    const event = this.ledger.record(
      actor,
      'workflow-created',
      workflow.id,
      {
        objective,
      },
    );

    program.events.push(event);
    program.updatedAt = event.at;
    return workflow;
  }

  startWorkflow(
    id: string,
    workflowId: string,
    actor: string,
  ) {
    const program = this.get(id);

    if (program.status !== 'active') {
      throw new Error(
        'Organization must be active before workflows can start.',
      );
    }

    const workflow = this.getWorkflow(program, workflowId);
    this.workflows.start(workflow);

    const event = this.ledger.record(
      actor,
      'workflow-started',
      workflow.id,
    );

    program.events.push(event);
    program.updatedAt = event.at;
    return workflow;
  }

  completeWorkflowStep(
    id: string,
    workflowId: string,
    stepId: string,
    output: Record<string, unknown>,
    actor: string,
  ) {
    const program = this.get(id);
    const workflow = this.getWorkflow(program, workflowId);

    this.workflows.completeStep(
      workflow,
      stepId,
      output,
    );

    const event = this.ledger.record(
      actor,
      'workflow-step-completed',
      stepId,
      {
        workflowId,
      },
    );

    program.events.push(event);
    program.updatedAt = event.at;
    return workflow;
  }

  requestApproval(
    id: string,
    category: string,
    targetId: string,
    requestedBy: string,
    reason: string,
  ) {
    const program = this.get(id);
    const request = this.approvals.request(
      category,
      targetId,
      requestedBy,
      reason,
    );

    program.approvals.push(request);
    const event = this.ledger.record(
      requestedBy,
      'approval-requested',
      request.id,
      {
        category,
        targetId,
      },
    );

    program.events.push(event);
    program.updatedAt = event.at;
    return request;
  }

  decideApproval(
    id: string,
    approvalId: string,
    approved: boolean,
    decidedBy: string,
  ) {
    const program = this.get(id);
    const request = program.approvals.find(
      (item) => item.id === approvalId,
    );

    if (!request) {
      throw new NotFoundException(
        `Approval request not found: ${approvalId}`,
      );
    }

    this.approvals.decide(
      request,
      approved,
      decidedBy,
    );

    const event = this.ledger.record(
      decidedBy,
      approved
        ? 'approval-approved'
        : 'approval-rejected',
      request.id,
      {
        targetId: request.targetId,
      },
    );

    program.events.push(event);
    program.updatedAt = event.at;
    return request;
  }

  approveWorkflowHumanStep(
    id: string,
    workflowId: string,
    stepId: string,
    approved: boolean,
    decidedBy: string,
  ) {
    const program = this.get(id);
    const workflow = this.getWorkflow(program, workflowId);

    this.workflows.approveHumanStep(
      workflow,
      stepId,
      approved,
    );

    const event = this.ledger.record(
      decidedBy,
      approved
        ? 'workflow-human-step-approved'
        : 'workflow-human-step-rejected',
      stepId,
      {
        workflowId,
      },
    );

    program.events.push(event);
    program.updatedAt = event.at;
    return workflow;
  }

  enableAutomationRule(
    id: string,
    ruleId: string,
    humanApproved: boolean,
    actor: string,
  ) {
    const program = this.get(id);
    const rule = program.automationRules.find(
      (item) => item.id === ruleId,
    );

    if (!rule) {
      throw new NotFoundException(
        `Automation rule not found: ${ruleId}`,
      );
    }

    this.automation.enable(
      rule,
      humanApproved,
    );

    const event = this.ledger.record(
      actor,
      'automation-rule-enabled',
      rule.id,
      {
        humanApproved,
      },
    );

    program.events.push(event);
    program.updatedAt = event.at;
    return rule;
  }

  evaluateAutomationRule(
    id: string,
    ruleId: string,
    context: Record<string, unknown>,
  ) {
    const program = this.get(id);
    const rule = program.automationRules.find(
      (item) => item.id === ruleId,
    );

    if (!rule) {
      throw new NotFoundException(
        `Automation rule not found: ${ruleId}`,
      );
    }

    return this.automation.evaluate(
      rule,
      context,
    );
  }

  dashboard() {
    const items = this.list();

    return {
      capabilities: this.capabilities(),
      totals: {
        programs: items.length,
        active: items.filter(
          (item) => item.status === 'active',
        ).length,
        agents: items.reduce(
          (sum, item) => sum + item.agents.length,
          0,
        ),
        teams: items.reduce(
          (sum, item) => sum + item.teams.length,
          0,
        ),
        workflows: items.reduce(
          (sum, item) => sum + item.workflows.length,
          0,
        ),
        activeWorkflows: items.reduce(
          (sum, item) =>
            sum +
            item.workflows.filter(
              (workflow) => workflow.status === 'running',
            ).length,
          0,
        ),
        automationRules: items.reduce(
          (sum, item) =>
            sum + item.automationRules.length,
          0,
        ),
        enabledAutomationRules: items.reduce(
          (sum, item) =>
            sum +
            item.automationRules.filter(
              (rule) => rule.enabled,
            ).length,
          0,
        ),
        pendingApprovals: items.reduce(
          (sum, item) =>
            sum +
            item.approvals.filter(
              (approval) => approval.status === 'pending',
            ).length,
          0,
        ),
        operationalEvents: items.reduce(
          (sum, item) => sum + item.events.length,
          0,
        ),
      },
      programs: items.map((item) => ({
        id: item.id,
        title: item.brief.title,
        projectId: item.brief.projectId,
        status: item.status,
        agents: item.agents.length,
        teams: item.teams.length,
        workflows: item.workflows.length,
        automationRules: item.automationRules.length,
        pendingApprovals: item.approvals.filter(
          (approval) => approval.status === 'pending',
        ).length,
        qualityApproved: item.quality.approved,
      })),
    };
  }

  private getWorkflow(
    program: OrganizationAutomationProgram,
    workflowId: string,
  ) {
    const workflow = program.workflows.find(
      (item) => item.id === workflowId,
    );

    if (!workflow) {
      throw new NotFoundException(
        `Workflow not found: ${workflowId}`,
      );
    }

    return workflow;
  }
}