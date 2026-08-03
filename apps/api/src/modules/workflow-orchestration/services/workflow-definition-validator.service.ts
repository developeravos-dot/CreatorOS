import {
  Injectable,
} from '@nestjs/common';

import type {
  WorkflowDefinition,
  WorkflowStep,
  WorkflowTransition,
} from '../models';

export type WorkflowValidationSeverity =
  | 'error'
  | 'warning';

export interface WorkflowValidationIssue {
  readonly code: string;
  readonly severity:
    WorkflowValidationSeverity;
  readonly message: string;
  readonly stepId?: string;
  readonly transitionId?: string;
  readonly triggerId?: string;
}

export interface WorkflowValidationResult {
  readonly valid: boolean;
  readonly errors:
    readonly WorkflowValidationIssue[];
  readonly warnings:
    readonly WorkflowValidationIssue[];
}

@Injectable()
export class WorkflowDefinitionValidatorService {
  validate(
    workflow:
      WorkflowDefinition,
  ): WorkflowValidationResult {
    const issues:
      WorkflowValidationIssue[] = [];

    this.validateIdentity(
      workflow,
      issues,
    );

    const stepMap =
      this.validateSteps(
        workflow,
        issues,
      );

    this.validateEntryStep(
      workflow,
      stepMap,
      issues,
    );

    this.validateTransitions(
      workflow,
      stepMap,
      issues,
    );

    this.validateDependencies(
      workflow,
      stepMap,
      issues,
    );

    this.validateCompensation(
      workflow,
      stepMap,
      issues,
    );

    this.validateTriggers(
      workflow,
      issues,
    );

    this.validateVariables(
      workflow,
      issues,
    );

    this.validateReachability(
      workflow,
      stepMap,
      issues,
    );

    const errors =
      issues.filter(
        (issue) =>
          issue.severity ===
          'error',
      );

    const warnings =
      issues.filter(
        (issue) =>
          issue.severity ===
          'warning',
      );

    return {
      valid:
        errors.length === 0,
      errors,
      warnings,
    };
  }

  assertValid(
    workflow:
      WorkflowDefinition,
  ): void {
    const result =
      this.validate(workflow);

    if (!result.valid) {
      throw new Error(
        result.errors
          .map(
            (issue) =>
              `${issue.code}: ${issue.message}`,
          )
          .join('; '),
      );
    }
  }

  private validateIdentity(
    workflow:
      WorkflowDefinition,
    issues:
      WorkflowValidationIssue[],
  ): void {
    if (!workflow.id.trim()) {
      issues.push({
        code:
          'WORKFLOW_ID_REQUIRED',
        severity:
          'error',
        message:
          'Workflow id is required.',
      });
    }

    if (!workflow.name.trim()) {
      issues.push({
        code:
          'WORKFLOW_NAME_REQUIRED',
        severity:
          'error',
        message:
          'Workflow name is required.',
      });
    }

    if (
      !Number.isInteger(
        workflow.version,
      ) ||
      workflow.version < 1
    ) {
      issues.push({
        code:
          'WORKFLOW_VERSION_INVALID',
        severity:
          'error',
        message:
          'Workflow version must be at least 1.',
      });
    }
  }

  private validateSteps(
    workflow:
      WorkflowDefinition,
    issues:
      WorkflowValidationIssue[],
  ): ReadonlyMap<string, WorkflowStep> {
    const stepMap =
      new Map<
        string,
        WorkflowStep
      >();

    if (
      workflow.steps.length === 0
    ) {
      issues.push({
        code:
          'WORKFLOW_STEPS_REQUIRED',
        severity:
          'error',
        message:
          'Workflow must contain at least one step.',
      });

      return stepMap;
    }

    for (
      const step
      of workflow.steps
    ) {
      const id =
        step.id.trim();

      if (!id) {
        issues.push({
          code:
            'STEP_ID_REQUIRED',
          severity:
            'error',
          message:
            'Workflow step id is required.',
        });

        continue;
      }

      if (stepMap.has(id)) {
        issues.push({
          code:
            'DUPLICATE_STEP_ID',
          severity:
            'error',
          message:
            `Duplicate workflow step id ${id}.`,
          stepId: id,
        });

        continue;
      }

      if (!step.name.trim()) {
        issues.push({
          code:
            'STEP_NAME_REQUIRED',
          severity:
            'error',
          message:
            `Workflow step ${id} requires a name.`,
          stepId: id,
        });
      }

      if (
        step.configuration
          .retry
          .maximumAttempts < 1
      ) {
        issues.push({
          code:
            'STEP_RETRY_ATTEMPTS_INVALID',
          severity:
            'error',
          message:
            `Workflow step ${id} maximumAttempts must be at least 1.`,
          stepId: id,
        });
      }

      if (
        step.configuration
          .timeout
          .timeoutMs !==
            undefined &&
        step.configuration
          .timeout
          .timeoutMs! < 1
      ) {
        issues.push({
          code:
            'STEP_TIMEOUT_INVALID',
          severity:
            'error',
          message:
            `Workflow step ${id} timeoutMs must be positive.`,
          stepId: id,
        });
      }

      stepMap.set(
        id,
        step,
      );
    }

    return stepMap;
  }

  private validateEntryStep(
    workflow:
      WorkflowDefinition,
    stepMap:
      ReadonlyMap<
        string,
        WorkflowStep
      >,
    issues:
      WorkflowValidationIssue[],
  ): void {
    if (
      !workflow.entryStepId
        .trim()
    ) {
      issues.push({
        code:
          'ENTRY_STEP_REQUIRED',
        severity:
          'error',
        message:
          'Workflow entryStepId is required.',
      });

      return;
    }

    if (
      !stepMap.has(
        workflow.entryStepId,
      )
    ) {
      issues.push({
        code:
          'ENTRY_STEP_NOT_FOUND',
        severity:
          'error',
        message:
          `Workflow entry step ${workflow.entryStepId} does not exist.`,
        stepId:
          workflow.entryStepId,
      });
    }
  }

  private validateTransitions(
    workflow:
      WorkflowDefinition,
    stepMap:
      ReadonlyMap<
        string,
        WorkflowStep
      >,
    issues:
      WorkflowValidationIssue[],
  ): void {
    const transitionIds =
      new Set<string>();

    const outgoingDefaults =
      new Map<string, number>();

    for (
      const transition
      of workflow.transitions
    ) {
      if (
        transitionIds.has(
          transition.id,
        )
      ) {
        issues.push({
          code:
            'DUPLICATE_TRANSITION_ID',
          severity:
            'error',
          message:
            `Duplicate workflow transition id ${transition.id}.`,
          transitionId:
            transition.id,
        });
      }

      transitionIds.add(
        transition.id,
      );

      if (
        !stepMap.has(
          transition.fromStepId,
        )
      ) {
        issues.push({
          code:
            'TRANSITION_SOURCE_NOT_FOUND',
          severity:
            'error',
          message:
            `Transition ${transition.id} source step ${transition.fromStepId} does not exist.`,
          transitionId:
            transition.id,
          stepId:
            transition.fromStepId,
        });
      }

      if (
        !stepMap.has(
          transition.toStepId,
        )
      ) {
        issues.push({
          code:
            'TRANSITION_TARGET_NOT_FOUND',
          severity:
            'error',
          message:
            `Transition ${transition.id} target step ${transition.toStepId} does not exist.`,
          transitionId:
            transition.id,
          stepId:
            transition.toStepId,
        });
      }

      if (
        transition.fromStepId ===
        transition.toStepId
      ) {
        issues.push({
          code:
            'TRANSITION_SELF_REFERENCE',
          severity:
            'warning',
          message:
            `Transition ${transition.id} references the same source and target step.`,
          transitionId:
            transition.id,
          stepId:
            transition.fromStepId,
        });
      }

      if (
        transition.priority < 0
      ) {
        issues.push({
          code:
            'TRANSITION_PRIORITY_INVALID',
          severity:
            'error',
          message:
            `Transition ${transition.id} priority cannot be negative.`,
          transitionId:
            transition.id,
        });
      }

      if (transition.default) {
        outgoingDefaults.set(
          transition.fromStepId,
          (
            outgoingDefaults.get(
              transition.fromStepId,
            ) ?? 0
          ) + 1,
        );
      }
    }

    for (
      const [stepId, count]
      of outgoingDefaults
    ) {
      if (count > 1) {
        issues.push({
          code:
            'MULTIPLE_DEFAULT_TRANSITIONS',
          severity:
            'error',
          message:
            `Workflow step ${stepId} has more than one default transition.`,
          stepId,
        });
      }
    }
  }

  private validateDependencies(
    workflow:
      WorkflowDefinition,
    stepMap:
      ReadonlyMap<
        string,
        WorkflowStep
      >,
    issues:
      WorkflowValidationIssue[],
  ): void {
    for (
      const step
      of workflow.steps
    ) {
      const uniqueDependencies =
        new Set<string>();

      for (
        const dependencyId
        of step.dependencies
      ) {
        if (
          dependencyId ===
          step.id
        ) {
          issues.push({
            code:
              'STEP_SELF_DEPENDENCY',
            severity:
              'error',
            message:
              `Workflow step ${step.id} cannot depend on itself.`,
            stepId:
              step.id,
          });
        }

        if (
          uniqueDependencies.has(
            dependencyId,
          )
        ) {
          issues.push({
            code:
              'DUPLICATE_STEP_DEPENDENCY',
            severity:
              'warning',
            message:
              `Workflow step ${step.id} contains duplicate dependency ${dependencyId}.`,
            stepId:
              step.id,
          });
        }

        uniqueDependencies.add(
          dependencyId,
        );

        if (
          !stepMap.has(
            dependencyId,
          )
        ) {
          issues.push({
            code:
              'STEP_DEPENDENCY_NOT_FOUND',
            severity:
              'error',
            message:
              `Workflow step ${step.id} dependency ${dependencyId} does not exist.`,
            stepId:
              step.id,
          });
        }
      }
    }

    const cycle =
      this.findDependencyCycle(
        workflow.steps,
      );

    if (cycle.length > 0) {
      issues.push({
        code:
          'CIRCULAR_STEP_DEPENDENCY',
        severity:
          'error',
        message:
          `Circular workflow dependency detected: ${cycle.join(' -> ')}.`,
        stepId:
          cycle[0],
      });
    }
  }

  private validateCompensation(
    workflow:
      WorkflowDefinition,
    stepMap:
      ReadonlyMap<
        string,
        WorkflowStep
      >,
    issues:
      WorkflowValidationIssue[],
  ): void {
    for (
      const step
      of workflow.steps
    ) {
      if (
        !step.compensationStepId
      ) {
        continue;
      }

      if (
        step.compensationStepId ===
        step.id
      ) {
        issues.push({
          code:
            'COMPENSATION_SELF_REFERENCE',
          severity:
            'error',
          message:
            `Workflow step ${step.id} cannot compensate itself.`,
          stepId:
            step.id,
        });

        continue;
      }

      const compensationStep =
        stepMap.get(
          step.compensationStepId,
        );

      if (!compensationStep) {
        issues.push({
          code:
            'COMPENSATION_STEP_NOT_FOUND',
          severity:
            'error',
          message:
            `Compensation step ${step.compensationStepId} for ${step.id} does not exist.`,
          stepId:
            step.id,
        });

        continue;
      }

      if (
        compensationStep.type !==
        'compensation'
      ) {
        issues.push({
          code:
            'COMPENSATION_STEP_TYPE_INVALID',
          severity:
            'warning',
          message:
            `Compensation step ${compensationStep.id} should use type compensation.`,
          stepId:
            compensationStep.id,
        });
      }
    }
  }

  private validateTriggers(
    workflow:
      WorkflowDefinition,
    issues:
      WorkflowValidationIssue[],
  ): void {
    const triggerIds =
      new Set<string>();

    for (
      const trigger
      of workflow.triggers
    ) {
      if (
        !trigger.id.trim()
      ) {
        issues.push({
          code:
            'TRIGGER_ID_REQUIRED',
          severity:
            'error',
          message:
            'Workflow trigger id is required.',
        });

        continue;
      }

      if (
        triggerIds.has(
          trigger.id,
        )
      ) {
        issues.push({
          code:
            'DUPLICATE_TRIGGER_ID',
          severity:
            'error',
          message:
            `Duplicate workflow trigger id ${trigger.id}.`,
          triggerId:
            trigger.id,
        });
      }

      triggerIds.add(
        trigger.id,
      );
    }

    if (
      workflow.state ===
        'active' &&
      !workflow.triggers.some(
        (trigger) =>
          trigger.enabled,
      )
    ) {
      issues.push({
        code:
          'ACTIVE_WORKFLOW_WITHOUT_TRIGGER',
        severity:
          'warning',
        message:
          'Active workflow has no enabled trigger.',
      });
    }
  }

  private validateVariables(
    workflow:
      WorkflowDefinition,
    issues:
      WorkflowValidationIssue[],
  ): void {
    const variableNames =
      new Set<string>();

    for (
      const variable
      of workflow.variables
    ) {
      const name =
        variable.name.trim();

      if (!name) {
        issues.push({
          code:
            'VARIABLE_NAME_REQUIRED',
          severity:
            'error',
          message:
            'Workflow variable name is required.',
        });

        continue;
      }

      if (
        variableNames.has(name)
      ) {
        issues.push({
          code:
            'DUPLICATE_VARIABLE_NAME',
          severity:
            'error',
          message:
            `Duplicate workflow variable ${name}.`,
        });
      }

      variableNames.add(name);
    }
  }

  private validateReachability(
    workflow:
      WorkflowDefinition,
    stepMap:
      ReadonlyMap<
        string,
        WorkflowStep
      >,
    issues:
      WorkflowValidationIssue[],
  ): void {
    if (
      !stepMap.has(
        workflow.entryStepId,
      )
    ) {
      return;
    }

    const adjacency =
      new Map<
        string,
        string[]
      >();

    for (
      const step
      of workflow.steps
    ) {
      adjacency.set(
        step.id,
        [],
      );
    }

    for (
      const transition
      of workflow.transitions
    ) {
      if (
        adjacency.has(
          transition.fromStepId,
        ) &&
        stepMap.has(
          transition.toStepId,
        )
      ) {
        adjacency
          .get(
            transition.fromStepId,
          )!
          .push(
            transition.toStepId,
          );
      }
    }

    for (
      const step
      of workflow.steps
    ) {
      for (
        const dependencyId
        of step.dependencies
      ) {
        if (
          adjacency.has(
            dependencyId,
          ) &&
          stepMap.has(step.id)
        ) {
          adjacency
            .get(
              dependencyId,
            )!
            .push(step.id);
        }
      }
    }

    const visited =
      new Set<string>();

    const stack = [
      workflow.entryStepId,
    ];

    while (
      stack.length > 0
    ) {
      const current =
        stack.pop()!;

      if (
        visited.has(current)
      ) {
        continue;
      }

      visited.add(current);

      for (
        const next
        of adjacency.get(
          current,
        ) ?? []
      ) {
        if (
          !visited.has(next)
        ) {
          stack.push(next);
        }
      }
    }

    for (
      const step
      of workflow.steps
    ) {
      if (
        !visited.has(step.id) &&
        step.type !==
          'compensation'
      ) {
        issues.push({
          code:
            'UNREACHABLE_STEP',
          severity:
            'warning',
          message:
            `Workflow step ${step.id} is unreachable from the entry step.`,
          stepId:
            step.id,
        });
      }
    }
  }

  private findDependencyCycle(
    steps:
      readonly WorkflowStep[],
  ): readonly string[] {
    const dependencies =
      new Map<
        string,
        readonly string[]
      >(
        steps.map(
          (step) => [
            step.id,
            step.dependencies,
          ],
        ),
      );

    const visiting =
      new Set<string>();

    const visited =
      new Set<string>();

    const path:
      string[] = [];

    const visit =
      (
        stepId: string,
      ):
        readonly string[] => {
        if (
          visiting.has(stepId)
        ) {
          const startIndex =
            path.indexOf(
              stepId,
            );

          return [
            ...path.slice(
              startIndex,
            ),
            stepId,
          ];
        }

        if (
          visited.has(stepId)
        ) {
          return [];
        }

        visiting.add(stepId);
        path.push(stepId);

        for (
          const dependencyId
          of dependencies.get(
            stepId,
          ) ?? []
        ) {
          if (
            !dependencies.has(
              dependencyId,
            )
          ) {
            continue;
          }

          const cycle =
            visit(
              dependencyId,
            );

          if (
            cycle.length > 0
          ) {
            return cycle;
          }
        }

        path.pop();
        visiting.delete(stepId);
        visited.add(stepId);

        return [];
      };

    for (
      const step
      of steps
    ) {
      const cycle =
        visit(step.id);

      if (
        cycle.length > 0
      ) {
        return cycle;
      }
    }

    return [];
  }
}