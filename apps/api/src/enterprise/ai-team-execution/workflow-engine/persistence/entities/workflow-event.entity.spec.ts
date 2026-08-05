import { WorkflowEventEntity } from './workflow-event.entity';

describe('WorkflowEventEntity', () => {
  const entity = new WorkflowEventEntity();

  it('creates an immutable event snapshot', () => {
    const payload = { value: 1 };

    const record = entity.create({
      id: 'event-1',
      executionId: 'execution-1',
      sequence: 1,
      type: 'workflow.started',
      payload,
    });

    payload.value = 2;

    expect(record.payload).toEqual({ value: 1 });
    expect(record.metadata).toEqual({});
  });

  it('trims event identifiers and type', () => {
    const record = entity.create({
      id: ' event-1 ',
      executionId: ' execution-1 ',
      sequence: 1,
      type: ' workflow.started ',
    });

    expect(record.id).toBe('event-1');
    expect(record.executionId).toBe('execution-1');
    expect(record.type).toBe('workflow.started');
  });

  it('requires a positive sequence', () => {
    expect(() =>
      entity.create({
        id: 'event-1',
        executionId: 'execution-1',
        sequence: 0,
        type: 'workflow.started',
      }),
    ).toThrow('Workflow event sequence must be a positive integer.');
  });

  it('requires an event type', () => {
    expect(() =>
      entity.create({
        id: 'event-1',
        executionId: 'execution-1',
        sequence: 1,
        type: ' ',
      }),
    ).toThrow('Workflow event type is required.');
  });
});
