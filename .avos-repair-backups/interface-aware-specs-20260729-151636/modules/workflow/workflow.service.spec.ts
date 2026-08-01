import { WorkflowService } from './workflow.service';

describe('WorkflowService', () => {
  let service: WorkflowService;

  beforeEach(() => {
    service = new WorkflowService();
  });

  it('should report operational status', () => {
    expect(service.getStatus()).toEqual({
      module: 'workflow',
      package: '@creatoros/workflow',
      status: 'operational',
      provider: 'InMemoryWorkflowEngine',
      definitions: 0,
      instances: 0,
      running: 0,
      paused: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
    });
  });

  it('should create a workflow definition', () => {
    const definition =
      service.createDefinition({
        name: 'Content Production',
        description:
          'Create and approve AVOS content.',
        tasks: [
          {
            name: 'Generate Idea',
            type: 'agent',
          },
          {
            name: 'Human Approval',
            type: 'approval',
          },
        ],
      });

    expect(definition.tasks).toHaveLength(2);
    expect(definition.status).toBe('active');
  });

  it('should start a workflow instance', () => {
    const definition =
      service.createDefinition({
        name: 'Research Workflow',
        tasks: [
          {
            name: 'Research',
            type: 'agent',
          },
        ],
      });

    const instance =
      service.startWorkflow({
        definitionId: definition.id,
        context: {
          topic: 'AI media',
        },
      });

    expect(instance.status).toBe('running');
    expect(instance.tasks[0]?.status)
      .toBe('running');
  });

  it('should complete all workflow tasks', () => {
    const definition =
      service.createDefinition({
        name: 'Two Step Workflow',
        tasks: [
          {
            name: 'Step One',
            type: 'action',
          },
          {
            name: 'Step Two',
            type: 'approval',
          },
        ],
      });

    const instance =
      service.startWorkflow({
        definitionId: definition.id,
      });

    service.completeCurrentTask(
      instance.id,
      {
        output: {
          result: 'step-one-complete',
        },
      },
    );

    const completed =
      service.completeCurrentTask(
        instance.id,
        {
          output: {
            approved: true,
          },
        },
      );

    expect(completed.status)
      .toBe('completed');

    expect(
      completed.tasks.every(
        (task) =>
          task.status === 'completed',
      ),
    ).toBe(true);
  });

  it('should pause and resume a workflow', () => {
    const definition =
      service.createDefinition({
        name: 'Approval Workflow',
        tasks: [
          {
            name: 'Wait for Approval',
            type: 'human',
          },
        ],
      });

    const instance =
      service.startWorkflow({
        definitionId: definition.id,
      });

    const paused =
      service.pauseWorkflow(instance.id);

    expect(paused.status).toBe('paused');

    const resumed =
      service.resumeWorkflow(instance.id);

    expect(resumed.status).toBe('running');
  });

  it('should fail the current task', () => {
    const definition =
      service.createDefinition({
        name: 'Failure Workflow',
        tasks: [
          {
            name: 'External Action',
            type: 'action',
          },
        ],
      });

    const instance =
      service.startWorkflow({
        definitionId: definition.id,
      });

    const failed =
      service.failCurrentTask(
        instance.id,
        {
          error: 'External service failed',
        },
      );

    expect(failed.status).toBe('failed');
    expect(failed.tasks[0]?.status)
      .toBe('failed');
  });
});
