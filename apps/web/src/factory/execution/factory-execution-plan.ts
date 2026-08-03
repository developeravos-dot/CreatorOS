import {
  FactoryError,
  createFactoryStepId,
} from "../domain";

import type {
  CreateFactoryExecutionPlanInput,
  CreateFactoryExecutionPlanStepInput,
  FactoryExecutionPlan,
  FactoryExecutionPlanId,
  FactoryExecutionPlanNextStepResult,
  FactoryExecutionPlanProgress,
  FactoryExecutionPlanStatus,
  FactoryExecutionPlanStep,
  FactoryExecutionPlanStepStatus,
  FactoryExecutionPlanValidationIssue,
  FactoryExecutionPlanValidationResult,
} from "./factory-execution-plan-types";

function normalizeText(
  value: string,
  fieldName: string,
): string {
  const normalized =
    value.trim();

  if (!normalized) {
    throw new FactoryError(
      `${fieldName} is required.`,
      {
        code:
          "INVALID_PACK",
        details: {
          fieldName,
        },
      },
    );
  }

  return normalized;
}

function normalizeTimestamp(
  value:
    string | undefined,
): string {
  if (!value) {
    return new Date()
      .toISOString();
  }

  const parsed =
    Date.parse(value);

  return Number.isFinite(parsed)
    ? new Date(parsed)
        .toISOString()
    : value;
}

export function createFactoryExecutionPlanId(
  value: string,
): FactoryExecutionPlanId {
  return normalizeText(
    value,
    "Execution plan id",
  ) as FactoryExecutionPlanId;
}

export function createFactoryExecutionPlan(
  input:
    CreateFactoryExecutionPlanInput,
): FactoryExecutionPlan {
  const timestamp =
    normalizeTimestamp(
      input.createdAt,
    );

  return {
    id:
      createFactoryExecutionPlanId(
        input.id,
      ),
    packId:
      input.packId,
    name:
      normalizeText(
        input.name,
        "Execution plan name",
      ),
    description:
      input.description
        ?.trim() ??
      "",
    status: "draft",
    version: 1,
    steps: [],
    createdAt:
      timestamp,
    updatedAt:
      timestamp,
    startedAt: null,
    completedAt: null,
    failedStepId: null,
    metadata:
      input.metadata ??
      {},
  };
}

export function addFactoryExecutionPlanStep(
  plan:
    FactoryExecutionPlan,
  input:
    CreateFactoryExecutionPlanStepInput,
  updatedAt?:
    string,
): FactoryExecutionPlan {
  const id =
    createFactoryStepId(
      input.id,
    );

  if (
    plan.steps.some(
      (step) =>
        step.id === id,
    )
  ) {
    throw new FactoryError(
      `Execution plan step already exists: ${id}.`,
      {
        code:
          "DUPLICATE_STEP",
        details: {
          planId:
            plan.id,
          stepId:
            id,
        },
      },
    );
  }

  if (
    !Number.isInteger(
      input.order,
    ) ||
    input.order < 0
  ) {
    throw new FactoryError(
      "Execution plan step order must be a non-negative integer.",
      {
        code:
          "INVALID_PACK",
        details: {
          stepId:
            id,
          order:
            input.order,
        },
      },
    );
  }

  const maxAttempts =
    input.maxAttempts ??
    1;

  if (
    !Number.isInteger(
      maxAttempts,
    ) ||
    maxAttempts < 1
  ) {
    throw new FactoryError(
      "Execution plan step maxAttempts must be a positive integer.",
      {
        code:
          "INVALID_PACK",
        details: {
          stepId:
            id,
          maxAttempts,
        },
      },
    );
  }

  const step:
    FactoryExecutionPlanStep = {
    id,
    planId:
      plan.id,
    packId:
      plan.packId,
    name:
      normalizeText(
        input.name,
        "Execution plan step name",
      ),
    description:
      input.description
        ?.trim() ??
      "",
    kind:
      input.kind,
    order:
      input.order,
    status:
      input.dependencies
        ?.length
        ? "pending"
        : "ready",
    dependencies: [
      ...new Set(
        input.dependencies ??
        [],
      ),
    ],
    rollbackStepId:
      input.rollbackStepId ??
      null,
    validationGateIds: [
      ...new Set(
        input.validationGateIds ??
        [],
      ),
    ],
    required:
      input.required ??
      true,
    attempts: 0,
    maxAttempts,
    startedAt: null,
    completedAt: null,
    error: null,
    metadata:
      input.metadata ??
      {},
  };

  return refreshFactoryExecutionPlanSteps({
    ...plan,
    steps: [
      ...plan.steps,
      step,
    ].sort(
      (left, right) =>
        left.order -
        right.order,
    ),
    version:
      plan.version + 1,
    updatedAt:
      normalizeTimestamp(
        updatedAt,
      ),
  });
}

export function findFactoryExecutionPlanStep(
  plan:
    FactoryExecutionPlan,
  stepId:
    FactoryExecutionPlanStep["id"],
): FactoryExecutionPlanStep | null {
  return (
    plan.steps.find(
      (step) =>
        step.id ===
        stepId,
    ) ??
    null
  );
}

function dependenciesSucceeded(
  plan:
    FactoryExecutionPlan,
  step:
    FactoryExecutionPlanStep,
): boolean {
  return step.dependencies.every(
    (dependencyId) => {
      const dependency =
        findFactoryExecutionPlanStep(
          plan,
          dependencyId,
        );

      return (
        dependency?.status ===
          "succeeded" ||
        dependency?.status ===
          "skipped" ||
        dependency?.status ===
          "rolled-back"
      );
    },
  );
}

function dependencyFailed(
  plan:
    FactoryExecutionPlan,
  step:
    FactoryExecutionPlanStep,
): boolean {
  return step.dependencies.some(
    (dependencyId) => {
      const dependency =
        findFactoryExecutionPlanStep(
          plan,
          dependencyId,
        );

      return (
        dependency?.status ===
          "failed" ||
        dependency?.status ===
          "cancelled" ||
        dependency?.status ===
          "blocked"
      );
    },
  );
}

export function refreshFactoryExecutionPlanSteps(
  plan:
    FactoryExecutionPlan,
): FactoryExecutionPlan {
  const steps =
    plan.steps.map(
      (step) => {
        if (
          step.status !==
            "pending" &&
          step.status !==
            "ready" &&
          step.status !==
            "blocked"
        ) {
          return step;
        }

        if (
          dependencyFailed(
            plan,
            step,
          )
        ) {
          return {
            ...step,
            status:
              "blocked" as const,
          };
        }

        if (
          dependenciesSucceeded(
            plan,
            step,
          )
        ) {
          return {
            ...step,
            status:
              "ready" as const,
          };
        }

        return {
          ...step,
          status:
            "pending" as const,
        };
      },
    );

  return {
    ...plan,
    steps,
  };
}

export function updateFactoryExecutionPlanStepStatus(
  plan:
    FactoryExecutionPlan,
  stepId:
    FactoryExecutionPlanStep["id"],
  status:
    FactoryExecutionPlanStepStatus,
  options: {
    readonly updatedAt?: string;
    readonly error?: string | null;
  } = {},
): FactoryExecutionPlan {
  const existing =
    findFactoryExecutionPlanStep(
      plan,
      stepId,
    );

  if (!existing) {
    throw new FactoryError(
      `Execution plan step was not found: ${stepId}.`,
      {
        code:
          "STEP_NOT_FOUND",
        details: {
          planId:
            plan.id,
          stepId,
        },
      },
    );
  }

  if (
    status === "running" &&
    existing.attempts >=
      existing.maxAttempts
  ) {
    throw new FactoryError(
      `Execution plan step exceeded its attempt limit: ${stepId}.`,
      {
        code:
          "EXECUTION_FAILED",
        details: {
          stepId,
          attempts:
            existing.attempts,
          maxAttempts:
            existing.maxAttempts,
        },
      },
    );
  }

  const timestamp =
    normalizeTimestamp(
      options.updatedAt,
    );

  const terminal =
    status === "succeeded" ||
    status === "failed" ||
    status === "skipped" ||
    status === "cancelled" ||
    status === "rolled-back";

  const updated:
    FactoryExecutionPlanStep = {
    ...existing,
    status,
    attempts:
      status === "running"
        ? existing.attempts + 1
        : existing.attempts,
    startedAt:
      existing.startedAt ??
      (
        status === "running"
          ? timestamp
          : null
      ),
    completedAt:
      terminal
        ? timestamp
        : existing.completedAt,
    error:
      status === "failed"
        ? options.error ??
          "Execution step failed."
        : options.error ??
          null,
  };

  const nextPlan =
    refreshFactoryExecutionPlanSteps({
      ...plan,
      steps:
        plan.steps.map(
          (step) =>
            step.id === stepId
              ? updated
              : step,
        ),
      failedStepId:
        status === "failed"
          ? stepId
          : plan.failedStepId,
      version:
        plan.version + 1,
      updatedAt:
        timestamp,
    });

  return nextPlan;
}

export function transitionFactoryExecutionPlan(
  plan:
    FactoryExecutionPlan,
  status:
    FactoryExecutionPlanStatus,
  updatedAt?:
    string,
): FactoryExecutionPlan {
  if (
    plan.status === status
  ) {
    return plan;
  }

  const allowed:
    Readonly<
      Record<
        FactoryExecutionPlanStatus,
        readonly FactoryExecutionPlanStatus[]
      >
    > = {
    draft: [
      "ready",
      "cancelled",
    ],

    ready: [
      "running",
      "cancelled",
    ],

    running: [
      "paused",
      "failed",
      "rolling-back",
      "completed",
      "cancelled",
    ],

    paused: [
      "running",
      "cancelled",
    ],

    failed: [
      "rolling-back",
      "ready",
      "cancelled",
    ],

    "rolling-back": [
      "rolled-back",
      "failed",
    ],

    "rolled-back": [
      "ready",
      "cancelled",
    ],

    completed: [],

    cancelled: [],
  };

  if (
    !allowed[
      plan.status
    ].includes(status)
  ) {
    throw new FactoryError(
      `Cannot transition execution plan from ${plan.status} to ${status}.`,
      {
        code:
          "INVALID_STATUS_TRANSITION",
        details: {
          planId:
            plan.id,
          currentStatus:
            plan.status,
          targetStatus:
            status,
        },
      },
    );
  }

  const timestamp =
    normalizeTimestamp(
      updatedAt,
    );

  return {
    ...plan,
    status,
    version:
      plan.version + 1,
    updatedAt:
      timestamp,
    startedAt:
      plan.startedAt ??
      (
        status === "running"
          ? timestamp
          : null
      ),
    completedAt:
      status === "completed" ||
      status === "rolled-back" ||
      status === "cancelled"
        ? timestamp
        : plan.completedAt,
  };
}

function detectDependencyCycle(
  plan:
    FactoryExecutionPlan,
  step:
    FactoryExecutionPlanStep,
  visiting:
    Set<string>,
  visited:
    Set<string>,
): boolean {
  if (
    visiting.has(
      step.id,
    )
  ) {
    return true;
  }

  if (
    visited.has(
      step.id,
    )
  ) {
    return false;
  }

  visiting.add(
    step.id,
  );

  for (
    const dependencyId of
    step.dependencies
  ) {
    const dependency =
      findFactoryExecutionPlanStep(
        plan,
        dependencyId,
      );

    if (
      dependency &&
      detectDependencyCycle(
        plan,
        dependency,
        visiting,
        visited,
      )
    ) {
      return true;
    }
  }

  visiting.delete(
    step.id,
  );

  visited.add(
    step.id,
  );

  return false;
}

export function validateFactoryExecutionPlan(
  plan:
    FactoryExecutionPlan,
): FactoryExecutionPlanValidationResult {
  const issues:
    FactoryExecutionPlanValidationIssue[] = [];

  if (
    plan.steps.length === 0
  ) {
    issues.push({
      code:
        "NO_STEPS",
      path: "steps",
      message:
        "Execution plan must contain at least one step.",
    });
  }

  const ids =
    new Set<string>();

  for (
    const step of
    plan.steps
  ) {
    if (
      ids.has(
        step.id,
      )
    ) {
      issues.push({
        code:
          "DUPLICATE_STEP",
        path:
          `steps.${step.id}`,
        message:
          `Duplicate execution plan step: ${step.id}.`,
      });
    }

    ids.add(
      step.id,
    );

    if (
      !Number.isInteger(
        step.order,
      ) ||
      step.order < 0
    ) {
      issues.push({
        code:
          "INVALID_ORDER",
        path:
          `steps.${step.id}.order`,
        message:
          "Execution plan step order must be a non-negative integer.",
      });
    }

    if (
      !Number.isInteger(
        step.maxAttempts,
      ) ||
      step.maxAttempts < 1
    ) {
      issues.push({
        code:
          "INVALID_ATTEMPT_LIMIT",
        path:
          `steps.${step.id}.maxAttempts`,
        message:
          "Execution plan step maxAttempts must be positive.",
      });
    }

    for (
      const dependencyId of
      step.dependencies
    ) {
      if (
        !findFactoryExecutionPlanStep(
          plan,
          dependencyId,
        )
      ) {
        issues.push({
          code:
            "MISSING_DEPENDENCY",
          path:
            `steps.${step.id}.dependencies`,
          message:
            `Execution dependency was not found: ${dependencyId}.`,
        });
      }
    }

    if (
      step.rollbackStepId &&
      !findFactoryExecutionPlanStep(
        plan,
        step.rollbackStepId,
      )
    ) {
      issues.push({
        code:
          "MISSING_ROLLBACK_STEP",
        path:
          `steps.${step.id}.rollbackStepId`,
        message:
          `Rollback step was not found: ${step.rollbackStepId}.`,
      });
    }
  }

  const visited =
    new Set<string>();

  for (
    const step of
    plan.steps
  ) {
    if (
      detectDependencyCycle(
        plan,
        step,
        new Set<string>(),
        visited,
      )
    ) {
      issues.push({
        code:
          "CIRCULAR_DEPENDENCY",
        path:
          `steps.${step.id}.dependencies`,
        message:
          `Circular execution dependency detected at ${step.id}.`,
      });

      break;
    }
  }

  return {
    valid:
      issues.length === 0,
    issues,
  };
}

export function getFactoryExecutionPlanNextStep(
  plan:
    FactoryExecutionPlan,
): FactoryExecutionPlanNextStepResult {
  const refreshed =
    refreshFactoryExecutionPlanSteps(
      plan,
    );

  const ready =
    refreshed.steps
      .filter(
        (step) =>
          step.status ===
          "ready",
      )
      .sort(
        (left, right) =>
          left.order -
          right.order,
      );

  return {
    step:
      ready[0] ??
      null,
    blocked:
      refreshed.steps.filter(
        (step) =>
          step.status ===
          "blocked",
      ),
  };
}

export function getFactoryExecutionRollbackSteps(
  plan:
    FactoryExecutionPlan,
): readonly FactoryExecutionPlanStep[] {
  return plan.steps
    .filter(
      (step) =>
        step.kind ===
          "rollback" ||
        step.rollbackStepId !==
          null,
    )
    .sort(
      (left, right) =>
        right.order -
        left.order,
    );
}

export function getFactoryExecutionValidationSteps(
  plan:
    FactoryExecutionPlan,
): readonly FactoryExecutionPlanStep[] {
  return plan.steps
    .filter(
      (step) =>
        step.kind ===
        "validation",
    )
    .sort(
      (left, right) =>
        left.order -
        right.order,
    );
}

export function summarizeFactoryExecutionPlan(
  plan:
    FactoryExecutionPlan,
): FactoryExecutionPlanProgress {
  const progress:
    FactoryExecutionPlanProgress = {
    total:
      plan.steps.length,
    pending: 0,
    ready: 0,
    running: 0,
    succeeded: 0,
    failed: 0,
    blocked: 0,
    skipped: 0,
    cancelled: 0,
    rolledBack: 0,
    completedPercent: 0,
  };

  const mutable =
    progress as {
      -readonly [
        Key in keyof FactoryExecutionPlanProgress
      ]: FactoryExecutionPlanProgress[Key];
    };

  for (
    const step of
    plan.steps
  ) {
    switch (
      step.status
    ) {
      case "pending":
        mutable.pending += 1;
        break;

      case "ready":
        mutable.ready += 1;
        break;

      case "running":
        mutable.running += 1;
        break;

      case "succeeded":
        mutable.succeeded += 1;
        break;

      case "failed":
        mutable.failed += 1;
        break;

      case "blocked":
        mutable.blocked += 1;
        break;

      case "skipped":
        mutable.skipped += 1;
        break;

      case "cancelled":
        mutable.cancelled += 1;
        break;

      case "rolled-back":
        mutable.rolledBack += 1;
        break;
    }
  }

  const completed =
    mutable.succeeded +
    mutable.skipped +
    mutable.rolledBack;

  mutable.completedPercent =
    mutable.total === 0
      ? 0
      : Math.round(
          (
            completed /
            mutable.total
          ) *
            100,
        );

  return progress;
}

export function isFactoryExecutionPlanComplete(
  plan:
    FactoryExecutionPlan,
): boolean {
  return (
    plan.steps.length > 0 &&
    plan.steps.every(
      (step) =>
        step.status ===
          "succeeded" ||
        step.status ===
          "skipped" ||
        step.status ===
          "rolled-back" ||
        (
          !step.required &&
          step.status ===
            "cancelled"
        ),
    )
  );
}
