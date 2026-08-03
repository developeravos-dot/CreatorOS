import {
  Injectable,
} from '@nestjs/common';

import {
  cloneWorkflowStep,
  type WorkflowDefinition,
  type WorkflowExecution,
  type WorkflowStep,
  type WorkflowStepExecution,
  type WorkflowStepState,
} from '../models';

export interface WorkflowDependencyResolution {
  readonly readySteps:
    readonly WorkflowStep[];

  readonly waitingSteps:
    readonly WorkflowStep[];

  readonly activeSteps:
    readonly WorkflowStep[];

  readonly completedSteps:
    readonly WorkflowStep[];

  readonly failedSteps:
    readonly WorkflowStep[];

  readonly skippedSteps:
    readonly WorkflowStep[];

  readonly blockedSteps:
    readonly WorkflowStep[];
}

@Injectable()
export class WorkflowDependencyResolverService {
  resolve(
    workflow:
      WorkflowDefinition,
    execution:
      WorkflowExecution,
  ): WorkflowDependencyResolution {
    if (
      workflow.id !==
      execution.workflowId
    ) {
      throw new Error(
        `Workflow ${workflow.id} does not match execution ${execution.id}.`,
      );
    }

    const latestStates =
      this.getLatestStepStates(
        execution.stepExecutions,
      );

    const readySteps:
      WorkflowStep[] = [];

    const waitingSteps:
      WorkflowStep[] = [];

    const activeSteps:
      WorkflowStep[] = [];

    const completedSteps:
      WorkflowStep[] = [];

    const failedSteps:
      WorkflowStep[] = [];

    const skippedSteps:
      WorkflowStep[] = [];

    const blockedSteps:
      WorkflowStep[] = [];

    for (
      const step
      of workflow.steps
    ) {
      const state =
        latestStates.get(
          step.id,
        ) ??
        'pending';

      if (
        state ===
          'completed' ||
        state ===
          'compensated'
      ) {
        completedSteps.push(
          step,
        );

        continue;
      }

      if (
        state ===
          'skipped' ||
        state ===
          'cancelled'
      ) {
        skippedSteps.push(
          step,
        );

        continue;
      }

      if (
        state ===
          'failed' ||
        state ===
          'timed_out'
      ) {
        failedSteps.push(
          step,
        );

        continue;
      }

      if (
        [
          'queued',
          'running',
          'waiting',
          'compensating',
        ].includes(state)
      ) {
        activeSteps.push(
          step,
        );

        continue;
      }

      if (
        this.hasFailedDependency(
          step,
          Object.fromEntries(
            latestStates,
          ),
        )
      ) {
        blockedSteps.push(
          step,
        );

        continue;
      }

      const dependenciesSatisfied =
        this.areDependenciesSatisfied(
          step,
          Object.fromEntries(
            latestStates,
          ),
        );

      const isEntryStep =
        step.id ===
        workflow.entryStepId;

      if (
        (
          isEntryStep &&
          step.dependencies.length ===
            0
        ) ||
        dependenciesSatisfied
      ) {
        readySteps.push(
          step,
        );
      } else {
        waitingSteps.push(
          step,
        );
      }
    }

    return {
      readySteps:
        this.cloneSteps(
          readySteps,
        ),

      waitingSteps:
        this.cloneSteps(
          waitingSteps,
        ),

      activeSteps:
        this.cloneSteps(
          activeSteps,
        ),

      completedSteps:
        this.cloneSteps(
          completedSteps,
        ),

      failedSteps:
        this.cloneSteps(
          failedSteps,
        ),

      skippedSteps:
        this.cloneSteps(
          skippedSteps,
        ),

      blockedSteps:
        this.cloneSteps(
          blockedSteps,
        ),
    };
  }

  areDependenciesSatisfied(
    step:
      WorkflowStep,
    stepStates:
      Readonly<
        Record<
          string,
          WorkflowStepState
        >
      >,
  ): boolean {
    return step.dependencies
      .every(
        (dependencyId) =>
          [
            'completed',
            'skipped',
            'compensated',
          ].includes(
            stepStates[
              dependencyId
            ] ??
            'pending',
          ),
      );
  }

  hasFailedDependency(
    step:
      WorkflowStep,
    stepStates:
      Readonly<
        Record<
          string,
          WorkflowStepState
        >
      >,
  ): boolean {
    return step.dependencies
      .some(
        (dependencyId) =>
          [
            'failed',
            'cancelled',
            'timed_out',
          ].includes(
            stepStates[
              dependencyId
            ] ??
            'pending',
          ),
      );
  }

  getDependents(
    workflow:
      WorkflowDefinition,
    stepId: string,
  ): readonly WorkflowStep[] {
    return workflow.steps
      .filter(
        (step) =>
          step.dependencies
            .includes(stepId),
      )
      .map(
        (step) =>
          cloneWorkflowStep(
            step,
          ),
      );
  }

  getDescendants(
    workflow:
      WorkflowDefinition,
    stepId: string,
  ): readonly WorkflowStep[] {
    const result =
      new Map<
        string,
        WorkflowStep
      >();

    const visit =
      (
        currentStepId: string,
      ): void => {
        for (
          const dependent
          of this.getDependents(
            workflow,
            currentStepId,
          )
        ) {
          if (
            result.has(
              dependent.id,
            )
          ) {
            continue;
          }

          result.set(
            dependent.id,
            dependent,
          );

          visit(
            dependent.id,
          );
        }
      };

    visit(stepId);

    return this.cloneSteps(
      [...result.values()],
    );
  }

  getAncestors(
    workflow:
      WorkflowDefinition,
    stepId: string,
  ): readonly WorkflowStep[] {
    const stepMap =
      new Map(
        workflow.steps.map(
          (step) => [
            step.id,
            step,
          ],
        ),
      );

    const result =
      new Map<
        string,
        WorkflowStep
      >();

    const visit =
      (
        currentStepId: string,
      ): void => {
        const current =
          stepMap.get(
            currentStepId,
          );

        if (!current) {
          return;
        }

        for (
          const dependencyId
          of current.dependencies
        ) {
          const dependency =
            stepMap.get(
              dependencyId,
            );

          if (
            !dependency ||
            result.has(
              dependency.id,
            )
          ) {
            continue;
          }

          result.set(
            dependency.id,
            dependency,
          );

          visit(
            dependency.id,
          );
        }
      };

    visit(stepId);

    return this.cloneSteps(
      [...result.values()],
    );
  }

  getRootSteps(
    workflow:
      WorkflowDefinition,
  ): readonly WorkflowStep[] {
    return workflow.steps
      .filter(
        (step) =>
          step.dependencies
            .length === 0,
      )
      .map(
        (step) =>
          cloneWorkflowStep(
            step,
          ),
      );
  }

  getLeafSteps(
    workflow:
      WorkflowDefinition,
  ): readonly WorkflowStep[] {
    const dependencyIds =
      new Set(
        workflow.steps
          .flatMap(
            (step) =>
              step.dependencies,
          ),
      );

    return workflow.steps
      .filter(
        (step) =>
          !dependencyIds.has(
            step.id,
          ),
      )
      .map(
        (step) =>
          cloneWorkflowStep(
            step,
          ),
      );
  }

  getLatestStepExecutions(
    executions:
      readonly WorkflowStepExecution[],
  ):
    ReadonlyMap<
      string,
      WorkflowStepExecution
    > {
    const latest =
      new Map<
        string,
        WorkflowStepExecution
      >();

    for (
      const execution
      of executions
    ) {
      const current =
        latest.get(
          execution.stepId,
        );

      if (
        !current ||
        execution.attemptNumber >
          current.attemptNumber
      ) {
        latest.set(
          execution.stepId,
          this.cloneStepExecution(
            execution,
          ),
        );
      }
    }

    return new Map(
      latest,
    );
  }

  getLatestStepStates(
    executions:
      readonly WorkflowStepExecution[],
  ):
    ReadonlyMap<
      string,
      WorkflowStepState
    > {
    return new Map(
      [
        ...this
          .getLatestStepExecutions(
            executions,
          )
          .entries(),
      ].map(
        ([
          stepId,
          execution,
        ]) => [
          stepId,
          execution.state,
        ],
      ),
    );
  }

  validateDependencies(
    workflow:
      WorkflowDefinition,
  ): readonly string[] {
    const stepIds =
      new Set(
        workflow.steps.map(
          (step) =>
            step.id,
        ),
      );

    const errors:
      string[] = [];

    for (
      const step
      of workflow.steps
    ) {
      for (
        const dependencyId
        of step.dependencies
      ) {
        if (
          dependencyId ===
          step.id
        ) {
          errors.push(
            `Step ${step.id} cannot depend on itself.`,
          );

          continue;
        }

        if (
          !stepIds.has(
            dependencyId,
          )
        ) {
          errors.push(
            `Step ${step.id} dependency ${dependencyId} was not found.`,
          );
        }
      }
    }

    return [
      ...new Set(errors),
    ];
  }

  private cloneSteps(
    steps:
      readonly WorkflowStep[],
  ): readonly WorkflowStep[] {
    return steps.map(
      (step) =>
        cloneWorkflowStep(
          step,
        ),
    );
  }

  private cloneStepExecution(
    execution:
      WorkflowStepExecution,
  ): WorkflowStepExecution {
    return {
      ...execution,
      input: {
        ...execution.input,
      },
      output: {
        ...execution.output,
      },
      error:
        execution.error
          ? {
              ...execution.error,
              details:
                execution.error
                  .details
                  ? {
                      ...execution.error
                        .details,
                    }
                  : undefined,
            }
          : undefined,
    };
  }
}