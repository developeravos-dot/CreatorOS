import { CommandCenterAlertService } from './alerts/command-center-alert.service';
import { CommandExecutionService } from './commands/command-execution.service';
import { MediaCommandDashboardService } from './dashboard/media-command-dashboard.service';
import { DecisionIntelligenceService } from './decisions/decision-intelligence.service';
import { CommandCenterEventLedgerService } from './events/command-center-event-ledger.service';
import { SystemHealthMonitorService } from './health/system-health-monitor.service';
import { MediaCommandCenterOrchestratorService } from './media-command-center-orchestrator.service';

describe('AVOS Media Command Center Mega Pack', () => {
  function service() {
    const health = new SystemHealthMonitorService();

    return new MediaCommandCenterOrchestratorService(
      health,
      new CommandExecutionService(),
      new CommandCenterAlertService(),
      new DecisionIntelligenceService(),
      new CommandCenterEventLedgerService(),
      new MediaCommandDashboardService(health),
    );
  }

  it('builds all six command center systems', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'AVOS Media Command Center',
      projectId: 'AVOS-MEDIA',
      mission: 'Provide unified operational command and visibility.',
      objectives: [
        'monitor-all-media-systems',
        'control-safe-execution',
        'support-human-decisions',
      ],
    });

    expect(program.systemHealth).toHaveLength(5);
    expect(program.commands).toHaveLength(0);
    expect(program.alerts).toHaveLength(0);
    expect(program.decisions).toHaveLength(0);
    expect(program.events.length).toBeGreaterThanOrEqual(1);
    expect(program.dashboard.overallHealth).toBeGreaterThanOrEqual(90);
  });

  it('requires human approval before activation', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Approval Test',
      projectId: 'MCC-1',
      mission: 'Test governance.',
      objectives: ['approval'],
    });

    expect(() =>
      orchestrator.activate(program.id, 'AI Operator'),
    ).toThrow();

    orchestrator.approve(program.id, 'Khalifa');
    orchestrator.activate(program.id, 'Khalifa');

    expect(program.status).toBe('active');
  });

  it('protects high-risk commands with human approval', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Command Test',
      projectId: 'MCC-2',
      mission: 'Test commands.',
      objectives: ['commands'],
    });

    orchestrator.approve(program.id, 'Khalifa');
    orchestrator.activate(program.id, 'Khalifa');

    const command = orchestrator.createCommand(
      program.id,
      'publish-global-campaign',
      'Audience & Distribution',
      {
        campaignId: 'CMP-1',
      },
      'high',
      'Distribution Agent',
    );

    expect(command.status).toBe('awaiting-human-approval');
    expect(() =>
      orchestrator.executeCommand(
        program.id,
        command.id,
        'Distribution Agent',
      ),
    ).toThrow();

    orchestrator.approveCommand(
      program.id,
      command.id,
      'Khalifa',
    );
    orchestrator.executeCommand(
      program.id,
      command.id,
      'Khalifa',
    );

    expect(command.status).toBe('completed');
  });

  it('creates alerts when health degrades', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Health Test',
      projectId: 'MCC-3',
      mission: 'Test health monitoring.',
      objectives: ['health'],
    });

    orchestrator.updateSystemHealth(
      program.id,
      'Creative Intelligence',
      {
        availability: 50,
        quality: 55,
        readiness: 60,
      },
      'Health Monitor',
    );

    expect(program.alerts).toHaveLength(1);
    expect(program.dashboard.activeAlerts).toBe(1);
    expect(
      program.systemHealth.find(
        (item) => item.system === 'Creative Intelligence',
      )?.status,
    ).toBe('critical');
  });

  it('records human decisions', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Decision Test',
      projectId: 'MCC-4',
      mission: 'Test decisions.',
      objectives: ['decisions'],
    });

    const decision = orchestrator.createDecision(
      program.id,
      'strategy',
      'Which distribution plan should be used?',
      ['controlled-launch', 'global-launch'],
      'controlled-launch',
      0.88,
      'Decision Intelligence',
    );

    orchestrator.decide(
      program.id,
      decision.id,
      'controlled-launch',
      'Khalifa',
    );

    expect(decision.decision).toBe('controlled-launch');
    expect(decision.decidedBy).toBe('Khalifa');
  });

  it('produces unified dashboard totals', () => {
    const orchestrator = service();

    orchestrator.create({
      title: 'Dashboard Test',
      projectId: 'MCC-5',
      mission: 'Test dashboard.',
      objectives: ['dashboard'],
    });

    const dashboard = orchestrator.dashboard();

    expect(dashboard.totals?.commandCenters).toBe(1);
    expect(dashboard.totals?.connectedSystems).toBe(5);
    expect(dashboard.capabilities.systems).toHaveLength(6);
  });
});