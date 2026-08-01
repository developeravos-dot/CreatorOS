import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CommandCenterAlertService } from './alerts/command-center-alert.service';
import { CommandExecutionService } from './commands/command-execution.service';
import { MediaCommandDashboardService } from './dashboard/media-command-dashboard.service';
import { DecisionIntelligenceService } from './decisions/decision-intelligence.service';
import { CommandCenterEventLedgerService } from './events/command-center-event-ledger.service';
import { SystemHealthMonitorService } from './health/system-health-monitor.service';
import {
  CommandCenterBrief,
  MediaCommandCenterProgram,
} from './media-command-center.types';

@Injectable()
export class MediaCommandCenterOrchestratorService {
  private readonly programs =
    new Map<string, MediaCommandCenterProgram>();

  constructor(
    private readonly health: SystemHealthMonitorService,
    private readonly commands: CommandExecutionService,
    private readonly alerts: CommandCenterAlertService,
    private readonly decisions: DecisionIntelligenceService,
    private readonly events: CommandCenterEventLedgerService,
    private readonly dashboardService: MediaCommandDashboardService,
  ) {}

  capabilities() {
    return {
      name: 'AVOS Media Command Center Mega Pack',
      version: 'MCC-MEGA-1.0.0',
      systems: [
        'Unified System Health Monitor',
        'Command Execution Center',
        'Alert Management Center',
        'Decision Intelligence Center',
        'Operational Event Ledger',
        'Executive Media Dashboard',
      ],
      governance: [
        'human-final-authority',
        'controlled-command-execution',
        'high-risk-command-approval',
        'full-audit-trail',
        'unified-operational-visibility',
      ],
    };
  }

  create(brief: CommandCenterBrief) {
    const now = new Date().toISOString();
    const creationEvent = this.events.record(
      'Media Command Center',
      'command-center-created',
    );

    const program: MediaCommandCenterProgram = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      status: 'awaiting-human-approval',
      brief,
      systemHealth: this.health.buildBaseline(brief),
      commands: [],
      alerts: [],
      decisions: [],
      events: [creationEvent],
      dashboard: {
        overallHealth: 0,
        healthySystems: 0,
        warningSystems: 0,
        criticalSystems: 0,
        offlineSystems: 0,
        pendingCommands: 0,
        pendingApprovals: 0,
        activeAlerts: 0,
        unresolvedDecisions: 0,
      },
      governance: {
        humanApproved: false,
        protectedPrinciples: [
          'human-final-authority',
          'controlled-command-execution',
          'full-audit-trail',
          ...(brief.protectedPrinciples ?? []),
        ],
        auditTrail: [creationEvent],
      },
    };

    program.dashboard =
      this.dashboardService.build(program);
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
        `Media Command Center program not found: ${id}`,
      );
    }

    return program;
  }

  approve(id: string, approvedBy: string) {
    const program = this.get(id);
    const event = this.events.record(
      approvedBy,
      'command-center-human-approved',
      program.id,
    );

    program.status = 'approved';
    program.updatedAt = event.at;
    program.governance.humanApproved = true;
    program.governance.approvedBy = approvedBy;
    program.governance.approvedAt = event.at;
    program.events.push(event);
    program.governance.auditTrail.push(event);

    return program;
  }

  activate(id: string, actor: string) {
    const program = this.get(id);

    if (!program.governance.humanApproved) {
      throw new Error(
        'Human approval is required before command center activation.',
      );
    }

    const event = this.events.record(
      actor,
      'command-center-activated',
      program.id,
    );

    program.status = 'active';
    program.updatedAt = event.at;
    program.events.push(event);
    program.governance.auditTrail.push(event);
    program.dashboard =
      this.dashboardService.build(program);

    return program;
  }

  updateSystemHealth(
    id: string,
    system: string,
    metrics: Record<string, number>,
    actor: string,
  ) {
    const program = this.get(id);
    const record = program.systemHealth.find(
      (item) => item.system === system,
    );

    if (!record) {
      throw new NotFoundException(
        `Connected system not found: ${system}`,
      );
    }

    this.health.update(record, metrics);

    if (
      record.status === 'warning' ||
      record.status === 'critical' ||
      record.status === 'offline'
    ) {
      program.alerts.push(
        this.alerts.create(
          record.status === 'warning'
            ? 'warning'
            : 'critical',
          system,
          `${system} health issue`,
          `Health score is ${record.score}.`,
        ),
      );
    }

    const event = this.events.record(
      actor,
      'system-health-updated',
      record.id,
      {
        system,
        score: record.score,
        status: record.status,
      },
    );

    program.events.push(event);
    program.updatedAt = event.at;
    program.dashboard =
      this.dashboardService.build(program);

    return record;
  }

  createCommand(
    id: string,
    command: string,
    targetSystem: string,
    payload: Record<string, unknown>,
    riskLevel: 'low' | 'medium' | 'high' | 'critical',
    requestedBy: string,
  ) {
    const program = this.get(id);
    const request = this.commands.create(
      command,
      targetSystem,
      payload,
      riskLevel,
      requestedBy,
    );

    program.commands.push(request);
    const event = this.events.record(
      requestedBy,
      'command-created',
      request.id,
      {
        targetSystem,
        riskLevel,
      },
    );

    program.events.push(event);
    program.updatedAt = event.at;
    program.dashboard =
      this.dashboardService.build(program);

    return request;
  }

  approveCommand(
    id: string,
    commandId: string,
    approvedBy: string,
  ) {
    const program = this.get(id);
    const command = this.getCommand(program, commandId);

    this.commands.approve(command, approvedBy);

    const event = this.events.record(
      approvedBy,
      'command-approved',
      command.id,
    );

    program.events.push(event);
    program.updatedAt = event.at;
    program.dashboard =
      this.dashboardService.build(program);

    return command;
  }

  executeCommand(
    id: string,
    commandId: string,
    actor: string,
  ) {
    const program = this.get(id);

    if (program.status !== 'active') {
      throw new Error(
        'Command Center must be active before command execution.',
      );
    }

    const command = this.getCommand(program, commandId);
    this.commands.execute(command);

    const event = this.events.record(
      actor,
      'command-executed',
      command.id,
      {
        targetSystem: command.targetSystem,
      },
    );

    program.events.push(event);
    program.updatedAt = event.at;
    program.dashboard =
      this.dashboardService.build(program);

    return command;
  }

  createDecision(
    id: string,
    category: string,
    question: string,
    options: string[],
    recommendation: string,
    confidence: number,
    actor: string,
  ) {
    const program = this.get(id);
    const decision = this.decisions.create(
      category,
      question,
      options,
      recommendation,
      confidence,
      true,
    );

    program.decisions.push(decision);
    const event = this.events.record(
      actor,
      'decision-created',
      decision.id,
    );

    program.events.push(event);
    program.updatedAt = event.at;
    program.dashboard =
      this.dashboardService.build(program);

    return decision;
  }

  decide(
    id: string,
    decisionId: string,
    decision: string,
    decidedBy: string,
  ) {
    const program = this.get(id);
    const record = program.decisions.find(
      (item) => item.id === decisionId,
    );

    if (!record) {
      throw new NotFoundException(
        `Decision not found: ${decisionId}`,
      );
    }

    this.decisions.decide(
      record,
      decision,
      decidedBy,
    );

    const event = this.events.record(
      decidedBy,
      'decision-recorded',
      record.id,
      {
        decision,
      },
    );

    program.events.push(event);
    program.updatedAt = event.at;
    program.dashboard =
      this.dashboardService.build(program);

    return record;
  }

  acknowledgeAlert(
    id: string,
    alertId: string,
    acknowledgedBy: string,
  ) {
    const program = this.get(id);
    const alert = program.alerts.find(
      (item) => item.id === alertId,
    );

    if (!alert) {
      throw new NotFoundException(
        `Alert not found: ${alertId}`,
      );
    }

    this.alerts.acknowledge(
      alert,
      acknowledgedBy,
    );

    const event = this.events.record(
      acknowledgedBy,
      'alert-acknowledged',
      alert.id,
    );

    program.events.push(event);
    program.updatedAt = event.at;
    program.dashboard =
      this.dashboardService.build(program);

    return alert;
  }

  dashboard(id?: string) {
    if (id) {
      const program = this.get(id);
      program.dashboard =
        this.dashboardService.build(program);

      return {
        capabilities: this.capabilities(),
        programId: program.id,
        title: program.brief.title,
        status: program.status,
        dashboard: program.dashboard,
        systemHealth: program.systemHealth,
        recentAlerts: program.alerts.slice(-10),
        recentCommands: program.commands.slice(-10),
        unresolvedDecisions: program.decisions.filter(
          (item) => !item.decision,
        ),
      };
    }

    const items = this.list();

    return {
      capabilities: this.capabilities(),
      totals: {
        commandCenters: items.length,
        active: items.filter(
          (item) => item.status === 'active',
        ).length,
        connectedSystems: items.reduce(
          (sum, item) =>
            sum + item.systemHealth.length,
          0,
        ),
        commands: items.reduce(
          (sum, item) => sum + item.commands.length,
          0,
        ),
        alerts: items.reduce(
          (sum, item) => sum + item.alerts.length,
          0,
        ),
        decisions: items.reduce(
          (sum, item) => sum + item.decisions.length,
          0,
        ),
      },
      programs: items.map((item) => ({
        id: item.id,
        title: item.brief.title,
        projectId: item.brief.projectId,
        status: item.status,
        overallHealth:
          this.dashboardService.build(item).overallHealth,
      })),
    };
  }

  private getCommand(
    program: MediaCommandCenterProgram,
    commandId: string,
  ) {
    const command = program.commands.find(
      (item) => item.id === commandId,
    );

    if (!command) {
      throw new NotFoundException(
        `Command not found: ${commandId}`,
      );
    }

    return command;
  }
}