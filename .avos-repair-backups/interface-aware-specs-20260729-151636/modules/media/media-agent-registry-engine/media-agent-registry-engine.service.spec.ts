import {
  BadRequestException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  MediaAgentRegistryEngineService,
} from './media-agent-registry-engine.service';

describe('MediaAgentRegistryEngineService', () => {
  let service: MediaAgentRegistryEngineService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [MediaAgentRegistryEngineService],
      }).compile();

    service =
      module.get<MediaAgentRegistryEngineService>(
        MediaAgentRegistryEngineService,
      );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    const dashboard = service.getDashboard();

    expect(dashboard.status).toBe(
      'operational',
    );

    expect(
      dashboard.humanFinalAuthority,
    ).toBe(true);
  });

  it('should create an AI agent', () => {
    const agent = service.createAgent({
      name: 'AVOS Research Agent',
      role: 'researcher',
      capabilities: [
        'market research',
        'trend detection',
      ],
      qualityScore: 90,
    });

    expect(agent.id).toBeDefined();
    expect(agent.role).toBe('researcher');
    expect(agent.qualityScore).toBe(90);
  });

  it('should reject empty agent name', () => {
    expect(() =>
      service.createAgent({
        name: '',
      }),
    ).toThrow(BadRequestException);
  });

  it('should create and assign task', () => {
    const agent = service.createAgent({
      name: 'Writer Agent',
      role: 'writer',
    });

    const task = service.createTask({
      title: 'Write media script',
      assignedAgentIds: [agent.id],
    });

    expect(task.status).toBe('assigned');
    expect(task.assignedAgentIds).toContain(
      agent.id,
    );
  });

  it('should start assigned task', () => {
    const agent = service.createAgent({
      name: 'Producer Agent',
      role: 'producer',
    });

    const task = service.createTask({
      title: 'Produce episode',
      assignedAgentIds: [agent.id],
    });

    const started = service.startTask(task.id);

    expect(started.status).toBe('working');
  });

  it('should require assigned agent before starting task', () => {
    const task = service.createTask({
      title: 'Unassigned task',
    });

    expect(() =>
      service.startTask(task.id),
    ).toThrow(BadRequestException);
  });

  it('should require human approval before completion', () => {
    const agent = service.createAgent({
      name: 'Editor Agent',
      role: 'editor',
    });

    const task = service.createTask({
      title: 'Edit content',
      assignedAgentIds: [agent.id],
    });

    service.startTask(task.id);
    service.submitTaskForHumanReview(task.id);

    expect(() =>
      service.completeTask(task.id),
    ).toThrow(BadRequestException);
  });

  it('should complete approved task', () => {
    const agent = service.createAgent({
      name: 'Publisher Agent',
      role: 'publisher',
    });

    const task = service.createTask({
      title: 'Publish content',
      assignedAgentIds: [agent.id],
    });

    service.startTask(task.id);
    service.submitTaskForHumanReview(task.id);
    service.approveTask(task.id);

    expect(
      service.completeTask(task.id).status,
    ).toBe('completed');
  });

  it('should create workflow', () => {
    const agent = service.createAgent({
      name: 'Coordinator',
      role: 'coordinator',
    });

    const task = service.createTask({
      title: 'Coordinate project',
      assignedAgentIds: [agent.id],
    });

    const workflow = service.createWorkflow({
      name: 'AVOS Production Workflow',
      taskIds: [task.id],
      agentIds: [agent.id],
    });

    expect(workflow.taskIds).toContain(task.id);
  });

  it('should complete approved workflow', () => {
    const agent = service.createAgent({
      name: 'Workflow Agent',
      role: 'coordinator',
    });

    const task = service.createTask({
      title: 'Workflow task',
      assignedAgentIds: [agent.id],
    });

    const workflow = service.createWorkflow({
      name: 'Approved Workflow',
      taskIds: [task.id],
      agentIds: [agent.id],
    });

    service.startWorkflow(workflow.id);
    service.submitWorkflowForHumanReview(
      workflow.id,
    );
    service.approveWorkflow(workflow.id);

    expect(
      service.completeWorkflow(workflow.id)
        .status,
    ).toBe('completed');
  });

  it('should write shared memory', () => {
    const agent = service.createAgent({
      name: 'Memory Agent',
      role: 'analyst',
    });

    const memory = service.writeMemory({
      key: 'winning-content-pattern',
      namespace: 'media-strategy',
      value: {
        retentionRate: 80,
      },
      sourceAgentId: agent.id,
    });

    expect(memory.version).toBe(1);
    expect(memory.approved).toBe(false);
  });

  it('should approve shared memory', () => {
    const memory = service.writeMemory({
      key: 'approved-insight',
      value: 'Human validated insight',
    });

    expect(
      service.approveMemory(memory.id).approved,
    ).toBe(true);
  });

  it('should require approval before executing decision', () => {
    const decision = service.createDecision({
      title: 'Launch new channel',
      confidence: 90,
      expectedImpact: 95,
    });

    expect(() =>
      service.executeDecision(decision.id),
    ).toThrow(BadRequestException);
  });

  it('should execute approved decision', () => {
    const decision = service.createDecision({
      title: 'Expand successful series',
      confidence: 95,
      expectedImpact: 90,
    });

    service.submitDecisionForHumanReview(
      decision.id,
    );

    service.approveDecision(
      decision.id,
      'Human Final Authority',
    );

    expect(
      service.executeDecision(decision.id)
        .status,
    ).toBe('executed');
  });

  it('should generate team plan', () => {
    const plan =
      service.generateTeamPlan('project-1');

    expect(plan.recommendedTeam).toHaveLength(
      12,
    );

    expect(plan.coordinationStages).toHaveLength(
      7,
    );
  });

  it('should generate organization report', () => {
    const report =
      service.generateOrganizationReport();

    expect(report.humanFinalAuthority).toBe(
      true,
    );

    expect(report.dashboard.status).toBe(
      'operational',
    );
  });
});
