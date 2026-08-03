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
  WorkflowExecutionJobPayload,
} from '../contracts';
import {
  WorkflowQueueDispatcherService,
} from '../services';

@Injectable()
export class WorkflowExecutionConsumer {
  constructor(
    private readonly engine:
      WorkflowExecutionEngineService,
    private readonly dispatcher:
      WorkflowQueueDispatcherService,
  ) {}

  async consume(
    context: QueueWorkerContext<
      WorkflowExecutionJobPayload
    >,
  ): Promise<unknown> {
    const dispatchId =
      this.requireDispatchId(context.payload);

    this.dispatcher.markProcessing(dispatchId);

    try {
      const result =
        await this.engine.runExecution(
          context.payload.executionId,
          {
            ...(context.payload.maxSteps !==
            undefined
              ? {
                  maxSteps:
                    context.payload.maxSteps,
                }
              : {}),
            ...(context.payload.stopOnFailure !==
            undefined
              ? {
                  stopOnFailure:
                    context.payload
                      .stopOnFailure,
                }
              : {}),
          },
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
    payload: WorkflowExecutionJobPayload,
  ): string {
    if (!payload.dispatchId?.trim()) {
      throw new TypeError(
        'Workflow execution payload dispatchId is required.',
      );
    }

    return payload.dispatchId;
  }
}
