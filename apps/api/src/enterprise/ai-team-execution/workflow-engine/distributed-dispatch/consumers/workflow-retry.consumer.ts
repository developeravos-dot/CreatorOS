import {
  Injectable,
} from '@nestjs/common';
import {
  QueueWorkerContext,
} from '../../../../../modules/queue-infrastructure';
import {
  WorkflowExecutionEngineService,
} from '../../execution-engine';
import {
  WorkflowStepOrchestratorService,
} from '../../orchestrator';
import {
  WorkflowRetryJobPayload,
} from '../contracts';
import {
  WorkflowQueueDispatcherService,
} from '../services';

@Injectable()
export class WorkflowRetryConsumer {
  constructor(
    private readonly orchestrator:
      WorkflowStepOrchestratorService,
    private readonly engine:
      WorkflowExecutionEngineService,
    private readonly dispatcher:
      WorkflowQueueDispatcherService,
  ) {}

  async consume(
    context: QueueWorkerContext<
      WorkflowRetryJobPayload
    >,
  ): Promise<unknown> {
    const dispatchId =
      this.requireDispatchId(context.payload);

    this.dispatcher.markProcessing(dispatchId);

    try {
      this.orchestrator.activateScheduledRetry(
        context.payload.executionId,
        context.payload.stepId,
        context.payload.scheduleId,
      );

      const result =
        await this.engine.runSingleStep(
          context.payload.executionId,
          context.payload.stepId,
        );

      this.dispatcher.markCompleted(dispatchId);

      return result;
    } catch (error) {
      this.dispatcher.markFailed(
        dispatchId,
        error,
      );

      throw error;
    }
  }

  private requireDispatchId(
    payload: WorkflowRetryJobPayload,
  ): string {
    if (!payload.dispatchId?.trim()) {
      throw new TypeError(
        'Workflow retry payload dispatchId is required.',
      );
    }

    return payload.dispatchId;
  }
}
