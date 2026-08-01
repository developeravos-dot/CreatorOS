import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  WorkflowOrchestratorService,
} from './workflow-orchestrator.service';

describe('WorkflowOrchestratorService', () => {
  let service: WorkflowOrchestratorService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [WorkflowOrchestratorService],
      }).compile();

    service = module.get<WorkflowOrchestratorService>(
      WorkflowOrchestratorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    const dashboard = service.getDashboard();

    expect(dashboard.status).toBe('operational');
    expect(dashboard.totalRecords).toBe(0);
  });

  it('should create and list automation', () => {
    const record = service.createRecord({
      name: 'Publishing Workflow',
      category: 'youtube',
      owner: 'CreatorOS',
      type: 'publishing',
      executionMode: 'autonomous',
      qualityScore: 85,
      reliabilityScore: 90,
      automationScore: 95,
      tags: ['YouTube', 'Automation'],
    });

    expect(record.id).toBeDefined();
    expect(record.tags).toEqual([
      'youtube',
      'automation',
    ]);
    expect(service.listRecords()).toHaveLength(1);
  });

  it('should reject empty name', () => {
    expect(() =>
      service.createRecord({
        name: '',
        category: 'youtube',
        owner: 'CreatorOS',
      }),
    ).toThrow(BadRequestException);
  });

  it('should reject empty owner', () => {
    expect(() =>
      service.createRecord({
        name: 'Automation',
        category: 'youtube',
        owner: '',
      }),
    ).toThrow(BadRequestException);
  });

  it('should update automation', () => {
    const record = service.createRecord({
      name: 'Update Automation',
      category: 'operations',
      owner: 'CreatorOS',
    });

    const updated = service.updateRecord(
      record.id,
      {
        priority: 'critical',
        automationScore: 92,
      },
    );

    expect(updated.priority).toBe('critical');
    expect(updated.automationScore).toBe(92);
  });

  it('should queue and start automation', () => {
    const record = service.createRecord({
      name: 'Workflow',
      category: 'workflow',
      owner: 'CreatorOS',
    });

    const queued = service.queueRecord(record.id);
    const running = service.startRecord(record.id);

    expect(queued.status).toBe('queued');
    expect(running.status).toBe('running');
    expect(running.startedAt).toBeDefined();
  });

  it('should pause running automation', () => {
    const record = service.createRecord({
      name: 'Pause Workflow',
      category: 'workflow',
      owner: 'CreatorOS',
    });

    service.startRecord(record.id);

    const paused = service.pauseRecord(record.id);

    expect(paused.status).toBe('paused');
  });

  it('should complete automation', () => {
    const record = service.createRecord({
      name: 'Complete Workflow',
      category: 'workflow',
      owner: 'CreatorOS',
    });

    const completed = service.completeRecord(
      record.id,
      {
        success: true,
      },
    );

    expect(completed.status).toBe('completed');
    expect(completed.progress).toBe(100);
    expect(completed.result).toEqual({
      success: true,
    });
  });

  it('should fail and retry automation', () => {
    const record = service.createRecord({
      name: 'Retry Workflow',
      category: 'workflow',
      owner: 'CreatorOS',
      maxRetries: 3,
    });

    const failed = service.failRecord(
      record.id,
      'Network failure',
    );

    const retried = service.retryRecord(record.id);

    expect(failed.status).toBe('failed');
    expect(failed.retryCount).toBe(1);
    expect(retried.status).toBe('queued');
  });

  it('should assign an agent', () => {
    const record = service.createRecord({
      name: 'Agent Workflow',
      category: 'agents',
      owner: 'CreatorOS',
    });

    const assigned = service.assignAgent(
      record.id,
      'Publishing Agent',
    );

    expect(assigned.assignedAgent).toBe(
      'Publishing Agent',
    );
    expect(assigned.type).toBe('agent-task');
  });

  it('should update progress', () => {
    const record = service.createRecord({
      name: 'Progress Workflow',
      category: 'workflow',
      owner: 'CreatorOS',
    });

    const updated = service.updateProgress(
      record.id,
      50,
    );

    expect(updated.progress).toBe(50);
    expect(updated.status).toBe('running');
  });

  it('should run quality check', () => {
    const record = service.createRecord({
      name: 'Quality Workflow',
      category: 'quality',
      owner: 'CreatorOS',
      executionMode: 'autonomous',
      qualityScore: 90,
      reliabilityScore: 90,
      automationScore: 90,
    });

    const quality =
      service.runQualityCheck(record.id);

    expect(quality.passed).toBe(true);
    expect(quality.issues).toHaveLength(0);
  });

  it('should generate execution plan', () => {
    const record = service.createRecord({
      name: 'Execution Workflow',
      category: 'workflow',
      owner: 'CreatorOS',
      assignedAgent: 'Workflow Agent',
    });

    const plan =
      service.generateExecutionPlan(record.id);

    expect(plan.steps.length).toBeGreaterThan(5);
    expect(plan.estimatedSteps).toBe(
      plan.steps.length,
    );
  });

  it('should return command center', () => {
    const record = service.createRecord({
      name: 'Failed Workflow',
      category: 'operations',
      owner: 'CreatorOS',
    });

    service.failRecord(
      record.id,
      'Execution failure',
    );

    const commandCenter =
      service.getCommandCenter();

    expect(
      commandCenter.attentionRequiredCount,
    ).toBe(1);
  });

  it('should remove automation', () => {
    const record = service.createRecord({
      name: 'Delete Workflow',
      category: 'operations',
      owner: 'CreatorOS',
    });

    service.removeRecord(record.id);

    expect(service.listRecords()).toHaveLength(0);
  });

  it('should throw for missing automation', () => {
    expect(() =>
      service.getRecord('missing-id'),
    ).toThrow(NotFoundException);
  });
});
