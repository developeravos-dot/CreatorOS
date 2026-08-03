import {
  Injectable,
} from '@nestjs/common';

import {
  WorkflowExecutionModel,
  cloneWorkflowStepExecution,
  type WorkflowExecution,
  type WorkflowExecutionState,
  type WorkflowStepExecution,
  type WorkflowStepState,
} from '../models';

@Injectable()
export class WorkflowExecutionStoreService {
  private readonly executions =
    new Map<string, WorkflowExecution>();

  create(
    execution:
      WorkflowExecution,
  ): WorkflowExecution {
    if (
      this.executions.has(
        execution.id,
      )
    ) {
      throw new Error(
        `Workflow execution ${execution.id} already exists.`,
      );
    }

    return this.save(execution);
  }

  save(
    execution:
      WorkflowExecution,
  ): WorkflowExecution {
    const snapshot =
      this.cloneExecution(
        execution,
      );

    this.executions.set(
      execution.id,
      snapshot,
    );

    return this.cloneExecution(
      snapshot,
    );
  }

  getById(
    executionId: string,
  ): WorkflowExecution | undefined {
    const execution =
      this.executions.get(
        executionId,
      );

    return execution
      ? this.cloneExecution(
          execution,
        )
      : undefined;
  }

  require(
    executionId: string,
  ): WorkflowExecution {
    const execution =
      this.getById(
        executionId,
      );

    if (!execution) {
      throw new Error(
        `Workflow execution ${executionId} was not found.`,
      );
    }

    return execution;
  }

  list():
    readonly WorkflowExecution[] {
    return [
      ...this.executions.values(),
    ]
      .sort(
        (left, right) =>
          right.createdAt.localeCompare(
            left.createdAt,
          ),
      )
      .map(
        (execution) =>
          this.cloneExecution(
            execution,
          ),
      );
  }

  listByWorkflow(
    workflowId: string,
  ): readonly WorkflowExecution[] {
    return this.list().filter(
      (execution) =>
        execution.workflowId ===
        workflowId,
    );
  }

  listByState(
    states:
      readonly WorkflowExecutionState[],
  ): readonly WorkflowExecution[] {
    const stateSet =
      new Set(states);

    return this.list().filter(
      (execution) =>
        stateSet.has(
          execution.state,
        ),
    );
  }

  listActive():
    readonly WorkflowExecution[] {
    return this.listByState([
      'pending',
      'queued',
      'running',
      'waiting',
      'paused',
      'compensating',
    ]);
  }

  replaceStepExecution(
    executionId: string,
    stepExecution:
      WorkflowStepExecution,
  ): WorkflowExecution {
    const execution =
      this.require(
        executionId,
      );

    if (
      stepExecution
        .workflowExecutionId !==
      executionId
    ) {
      throw new Error(
        `Step execution ${stepExecution.id} does not belong to workflow execution ${executionId}.`,
      );
    }

    const existingIndex =
      execution.stepExecutions
        .findIndex(
          (candidate) =>
            candidate.id ===
            stepExecution.id,
        );

    const replacement =
      cloneWorkflowStepExecution(
        stepExecution,
      );

    const stepExecutions =
      existingIndex >= 0
        ? execution.stepExecutions.map(
            (candidate, index) =>
              index === existingIndex
                ? replacement
                : cloneWorkflowStepExecution(
                    candidate,
                  ),
          )
        : [
            ...execution.stepExecutions.map(
              (candidate) =>
                cloneWorkflowStepExecution(
                  candidate,
                ),
            ),
            replacement,
          ];

    return this.save({
      ...execution,
      stepExecutions,
      updatedAt:
        new Date().toISOString(),
    });
  }

  getStepExecutions(
    executionId: string,
    stepId?: string,
  ): readonly WorkflowStepExecution[] {
    return this.require(
      executionId,
    )
      .stepExecutions
      .filter(
        (execution) =>
          !stepId ||
          execution.stepId ===
            stepId,
      )
      .map(
        (execution) =>
          cloneWorkflowStepExecution(
            execution,
          ),
      );
  }

  getLatestStepExecution(
    executionId: string,
    stepId: string,
  ): WorkflowStepExecution | undefined {
    return [
      ...this.getStepExecutions(
        executionId,
        stepId,
      ),
    ].sort(
      (left, right) =>
        right.attemptNumber -
        left.attemptNumber,
    )[0];
  }

  getStepStates(
    executionId: string,
  ):
    Readonly<
      Record<
        string,
        WorkflowStepState
      >
    > {
    const execution =
      this.require(
        executionId,
      );

    const latestByStep =
      new Map<
        string,
        WorkflowStepExecution
      >();

    for (
      const stepExecution
      of execution.stepExecutions
    ) {
      const current =
        latestByStep.get(
          stepExecution.stepId,
        );

      if (
        !current ||
        stepExecution.attemptNumber >
          current.attemptNumber
      ) {
        latestByStep.set(
          stepExecution.stepId,
          stepExecution,
        );
      }
    }

    return Object.fromEntries(
      [...latestByStep.entries()]
        .map(
          ([
            stepId,
            stepExecution,
          ]) => [
            stepId,
            stepExecution.state,
          ],
        ),
    );
  }

  delete(
    executionId: string,
  ): boolean {
    return this.executions.delete(
      executionId,
    );
  }

  deleteByWorkflow(
    workflowId: string,
  ): number {
    let deleted = 0;

    for (
      const [
        executionId,
        execution,
      ]
      of this.executions.entries()
    ) {
      if (
        execution.workflowId ===
        workflowId
      ) {
        this.executions.delete(
          executionId,
        );

        deleted += 1;
      }
    }

    return deleted;
  }

  count(): number {
    return this.executions.size;
  }

  clear(): void {
    this.executions.clear();
  }

  private cloneExecution(
    execution:
      WorkflowExecution,
  ): WorkflowExecution {
    return new WorkflowExecutionModel(
      execution,
    ).toContract();
  }
}