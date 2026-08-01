import { SpecialistAgentRegistryService } from './agents/specialist-agent-registry.service';
import { HumanApprovalService } from './approval/human-approval.service';
import { AutomationRuleEngineService } from './automation/automation-rule-engine.service';
import { OrganizationAutomationOrchestratorService } from './organization-automation-orchestrator.service';
import { OperationalLedgerService } from './operations/operational-ledger.service';
import { OrganizationAutomationQualityService } from './quality/organization-automation-quality.service';
import { DigitalTeamBuilderService } from './teams/digital-team-builder.service';
import { WorkflowOrchestrationService } from './workflow/workflow-orchestration.service';

describe('AVOS Organization & Automation Mega Pack', () => {
  function service() {
    return new OrganizationAutomationOrchestratorService(
      new SpecialistAgentRegistryService(),
      new DigitalTeamBuilderService(),
      new WorkflowOrchestrationService(),
      new AutomationRuleEngineService(),
      new HumanApprovalService(),
      new OperationalLedgerService(),
      new OrganizationAutomationQualityService(),
    );
  }

  function createProgram() {
    return service().create({
      title: 'AVOS Media Digital Organization',
      projectId: 'AVOS-MEDIA',
      mission:
        'Operate AVOS Media through coordinated specialist AI teams.',
      objectives: [
        'plan-original-content',
        'coordinate-production',
        'protect-quality-and-ip',
      ],
      automationGoals: [
        'route-new-work',
        'detect-blockers',
        'request-human-approval',
        'record-operational-events',
      ],
      protectedPrinciples: [
        'human-final-authority',
      ],
    });
  }

  it('builds all six organization systems', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Organization Test',
      projectId: 'ORG-1',
      mission: 'Build a coordinated AI organization.',
      objectives: [
        'research',
        'production',
        'distribution',
      ],
    });

    expect(program.agents.length).toBeGreaterThanOrEqual(8);
    expect(program.teams.length).toBeGreaterThanOrEqual(4);
    expect(program.workflows).toHaveLength(3);
    expect(program.automationRules.length).toBeGreaterThanOrEqual(4);
    expect(program.approvals).toHaveLength(0);
    expect(program.events.length).toBeGreaterThanOrEqual(1);
  });

  it('requires human approval before activation', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Approval Test',
      projectId: 'ORG-2',
      mission: 'Test governance.',
      objectives: ['test'],
    });

    expect(() =>
      orchestrator.activate(program.id, 'AI Coordinator'),
    ).toThrow();

    orchestrator.approveProgram(program.id, 'Khalifa');
    orchestrator.activate(program.id, 'Khalifa');

    expect(program.status).toBe('active');
    expect(program.quality.approved).toBe(true);
  });

  it('starts and advances workflows', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Workflow Test',
      projectId: 'ORG-3',
      mission: 'Test workflow orchestration.',
      objectives: ['produce-content'],
    });

    orchestrator.approveProgram(program.id, 'Khalifa');
    orchestrator.activate(program.id, 'Khalifa');

    const workflow = program.workflows[0];

    if (!workflow) {
      throw new Error('Expected a workflow.');
    }

    orchestrator.startWorkflow(
      program.id,
      workflow.id,
      'Operations Coordinator',
    );

    const firstStep = workflow.steps[0];

    if (!firstStep) {
      throw new Error('Expected a workflow step.');
    }

    orchestrator.completeWorkflowStep(
      program.id,
      workflow.id,
      firstStep.id,
      {
        analysis: 'complete',
      },
      'Research Intelligence Specialist',
    );

    expect(workflow.status).toBe('running');
    expect(firstStep.status).toBe('completed');
    expect(workflow.steps[1]?.status).toBe('ready');
  });

  it('creates and decides human approvals', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Approval System Test',
      projectId: 'ORG-4',
      mission: 'Test approval handling.',
      objectives: ['approval'],
    });

    const request = orchestrator.requestApproval(
      program.id,
      'strategic-change',
      'change-1',
      'AI Council',
      'Strategic authority is required.',
    );

    orchestrator.decideApproval(
      program.id,
      request.id,
      true,
      'Khalifa',
    );

    expect(request.status).toBe('approved');
    expect(request.decidedBy).toBe('Khalifa');
  });

  it('protects high-risk automation with human approval', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Automation Test',
      projectId: 'ORG-5',
      mission: 'Test safe automation.',
      objectives: ['automation'],
      automationGoals: [
        'request-human-approval',
      ],
    });

    const rule = program.automationRules[0];

    if (!rule) {
      throw new Error('Expected an automation rule.');
    }

    expect(() =>
      orchestrator.enableAutomationRule(
        program.id,
        rule.id,
        false,
        'Automation Engineer',
      ),
    ).toThrow();

    orchestrator.enableAutomationRule(
      program.id,
      rule.id,
      true,
      'Khalifa',
    );

    const result =
      orchestrator.evaluateAutomationRule(
        program.id,
        rule.id,
        {
          programActive: true,
          requiredDataPresent: true,
          riskApproved: true,
        },
      );

    expect(rule.enabled).toBe(true);
    expect(result.matched).toBe(true);
  });

  it('produces dashboard totals', () => {
    const orchestrator = service();

    orchestrator.create({
      title: 'Dashboard Test',
      projectId: 'ORG-6',
      mission: 'Test dashboard.',
      objectives: ['dashboard'],
    });

    const dashboard = orchestrator.dashboard();

    expect(dashboard.totals.programs).toBe(1);
    expect(dashboard.totals.agents).toBeGreaterThanOrEqual(8);
    expect(dashboard.totals.teams).toBeGreaterThanOrEqual(4);
    expect(dashboard.capabilities.systems).toHaveLength(6);
  });
});