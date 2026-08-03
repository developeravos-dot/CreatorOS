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
  WorkflowStepJobPayload,
} from '../contracts';
import {
  WorkflowQueueDispatcherService,
} from '../services';

@Injectable()
export class WorkflowStepConsumer {
  constructor(
    private readonly engine:
      WorkflowExecutionEngineService,
    private readonly dispatcher:
      WorkflowQueueDispatcherService,
  ) {}

  async consume(
    context: QueueWorkerContext<
      WorkflowStepJobPayload
    >,
  ): Promise<unknown> {
    const dispatchId =
      this.requireDispatchId(context.payload);

    this.dispatcher.markProcessing(dispatchId);

    try {
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
    payload: WorkflowStepJobPayload,
  ): string {
    if (!payload.dispatchId?.trim()) {
      throw new TypeError(
        'Workflow step payload dispatchId is required.',
      );
    }

    return payload.dispatchId;
  }
}
