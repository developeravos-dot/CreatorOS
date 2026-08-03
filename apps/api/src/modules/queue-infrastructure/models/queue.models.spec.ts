import {
  createEmptyQueueMetrics,
  QueueEvent,
  QueueWorkerMetrics,
} from './queue.models';

describe('queue models', () => {
  it('creates empty queue metrics', () => {
    const collectedAt = new Date(
      '2026-08-04T00:00:00.000Z',
    );

    expect(
      createEmptyQueueMetrics(
        'workflow-execution',
        collectedAt,
      ),
    ).toEqual({
      queueName: 'workflow-execution',
      waiting: 0,
      delayed: 0,
      active: 0,
      completed: 0,
      failed: 0,
      paused: false,
      throughputPerMinute: 0,
      averageProcessingTimeMs: 0,
      collectedAt,
    });
  });

  it('models worker runtime metrics', () => {
    const metrics: QueueWorkerMetrics = {
      workerName: 'workflow-worker',
      queueName: 'workflow-execution',
      concurrency: 4,
      activeJobs: 2,
      completedJobs: 100,
      failedJobs: 1,
      lastHeartbeatAt: new Date(
        '2026-08-04T00:00:00.000Z',
      ),
      status: 'running',
    };

    expect(metrics.concurrency).toBe(4);
    expect(metrics.status).toBe('running');
  });

  it('models queue lifecycle events', () => {
    const event: QueueEvent = {
      id: 'event-1',
      queueName: 'workflow-execution',
      jobId: 'job-1',
      type: 'job.completed',
      timestamp: new Date(
        '2026-08-04T00:00:00.000Z',
      ),
      payload: {
        durationMs: 250,
      },
    };

    expect(event.type).toBe('job.completed');
  });
});
