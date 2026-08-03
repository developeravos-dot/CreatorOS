import {
  FactoryError,
} from "./factory-error";

import type {
  CreateFactoryExecutionStepInput,
  CreateFactoryPackInput,
  CreateFactoryValidationGateInput,
  FactoryExecutionResult,
  FactoryExecutionStep,
  FactoryExecutionStepStatus,
  FactoryPack,
  FactoryPackId,
  FactoryPackStatus,
  FactoryStepId,
  FactoryValidationGate,
  FactoryValidationGateId,
  FactoryValidationGateStatus,
} from "./factory-types";

const PACK_STATUS_TRANSITIONS:
  Readonly<
    Record<
      FactoryPackStatus,
      readonly FactoryPackStatus[]
    >
  > = {
  draft: [
    "planned",
    "cancelled",
  ],

  planned: [
    "generating",
    "cancelled",
  ],

  generating: [
    "integrating",
    "failed",
    "cancelled",
  ],

  integrating: [
    "validating",
    "failed",
    "cancelled",
  ],

  validating: [
    "repairing",
    "completed",
    "failed",
    "cancelled",
  ],

  repairing: [
    "validating",
    "failed",
    "cancelled",
  ],

  failed: [
    "planned",
    "repairing",
    "cancelled",
  ],

  completed: [],

  cancelled: [
    "draft",
  ],
};

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

export function createFactoryPackId(
  value: string,
): FactoryPackId {
  return normalizeText(
    value,
    "Pack id",
  ) as FactoryPackId;
}

export function createFactoryStepId(
  value: string,
): FactoryStepId {
  return normalizeText(
    value,
    "Step id",
  ) as FactoryStepId;
}

export function createFactoryValidationGateId(
  value: string,
): FactoryValidationGateId {
  return normalizeText(
    value,
    "Validation gate id",
  ) as FactoryValidationGateId;
}

export function createFactoryPack(
  input:
    CreateFactoryPackInput,
): FactoryPack {
  const timestamp =
    normalizeTimestamp(
      input.createdAt,
    );

  return {
    id:
      createFactoryPackId(
        input.id,
      ),
    name:
      normalizeText(
        input.name,
        "Pack name",
      ),
    description:
      input.description
        ?.trim() ??
      "",
    type:
      input.type,
    status:
      "draft",
    version: 1,
    createdAt:
      timestamp,
    updatedAt:
      timestamp,
    startedAt:
      null,
    completedAt:
      null,
    steps: [],
    validationGates: [],
    errors: [],
    metadata:
      input.metadata ??
      {},
  };
}

export function transitionFactoryPack(
  pack:
    FactoryPack,
  status:
    FactoryPackStatus,
  updatedAt?:
    string,
): FactoryPack {
  if (
    pack.status ===
    status
  ) {
    return pack;
  }

  if (
    !PACK_STATUS_TRANSITIONS[
      pack.status
    ].includes(status)
  ) {
    throw new FactoryError(
      `Cannot transition factory pack from ${pack.status} to ${status}.`,
      {
        code:
          "INVALID_STATUS_TRANSITION",
        details: {
          packId:
            pack.id,
          currentStatus:
            pack.status,
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
    ...pack,
    status,
    version:
      pack.version + 1,
    updatedAt:
      timestamp,
    startedAt:
      pack.startedAt ??
      (
        status ===
          "generating"
          ? timestamp
          : null
      ),
    completedAt:
      status ===
        "completed" ||
      status ===
        "cancelled"
        ? timestamp
        : pack.completedAt,
  };
}

export function createFactoryExecutionStep(
  packId:
    FactoryPackId,
  input:
    CreateFactoryExecutionStepInput,
): FactoryExecutionStep {
  if (
    !Number.isInteger(
      input.order,
    ) ||
    input.order < 0
  ) {
    throw new FactoryError(
      "Execution step order must be a non-negative integer.",
      {
        code:
          "INVALID_PACK",
        details: {
          stepId:
            input.id,
          order:
            input.order,
        },
      },
    );
  }

  return {
    id:
      createFactoryStepId(
        input.id,
      ),
    packId,
    type:
      input.type,
    name:
      normalizeText(
        input.name,
        "Step name",
      ),
    description:
      input.description
        ?.trim() ??
      "",
    order:
      input.order,
    status:
      "pending",
    dependsOn:
      input.dependsOn ??
      [],
    startedAt:
      null,
    completedAt:
      null,
    attempts: 0,
    error: null,
  };
}

export function addFactoryExecutionStep(
  pack:
    FactoryPack,
  input:
    CreateFactoryExecutionStepInput,
  updatedAt?:
    string,
): FactoryPack {
  const step =
    createFactoryExecutionStep(
      pack.id,
      input,
    );

  if (
    pack.steps.some(
      (current) =>
        current.id ===
        step.id,
    )
  ) {
    throw new FactoryError(
      `Factory step already exists: ${step.id}.`,
      {
        code:
          "DUPLICATE_STEP",
        details: {
          packId:
            pack.id,
          stepId:
            step.id,
        },
      },
    );
  }

  return {
    ...pack,
    steps: [
      ...pack.steps,
      step,
    ].sort(
      (left, right) =>
        left.order -
        right.order,
    ),
    version:
      pack.version + 1,
    updatedAt:
      normalizeTimestamp(
        updatedAt,
      ),
  };
}

export function updateFactoryExecutionStepStatus(
  pack:
    FactoryPack,
  stepId:
    FactoryStepId,
  status:
    FactoryExecutionStepStatus,
  options: {
    readonly updatedAt?: string;
    readonly error?:
      FactoryError | null;
  } = {},
): FactoryPack {
  const existing =
    pack.steps.find(
      (step) =>
        step.id ===
        stepId,
    );

  if (!existing) {
    throw new FactoryError(
      `Factory execution step was not found: ${stepId}.`,
      {
        code:
          "STEP_NOT_FOUND",
        details: {
          packId:
            pack.id,
          stepId,
        },
      },
    );
  }

  const timestamp =
    normalizeTimestamp(
      options.updatedAt,
    );

  const updated:
    FactoryExecutionStep = {
    ...existing,
    status,
    startedAt:
      existing.startedAt ??
      (
        status ===
          "running"
          ? timestamp
          : null
      ),
    completedAt:
      status ===
        "succeeded" ||
      status ===
        "failed" ||
      status ===
        "skipped" ||
      status ===
        "cancelled"
        ? timestamp
        : existing.completedAt,
    attempts:
      status ===
        "running"
        ? existing.attempts + 1
        : existing.attempts,
    error:
      options.error
        ?.toSnapshot() ??
      (
        status ===
          "failed"
          ? existing.error
          : null
      ),
  };

  return {
    ...pack,
    steps:
      pack.steps.map(
        (step) =>
          step.id ===
          stepId
            ? updated
            : step,
      ),
    errors:
      options.error
        ? [
            ...pack.errors,
            options.error
              .toSnapshot(),
          ]
        : pack.errors,
    version:
      pack.version + 1,
    updatedAt:
      timestamp,
  };
}

export function createFactoryValidationGate(
  packId:
    FactoryPackId,
  input:
    CreateFactoryValidationGateInput,
): FactoryValidationGate {
  return {
    id:
      createFactoryValidationGateId(
        input.id,
      ),
    packId,
    type:
      input.type,
    name:
      normalizeText(
        input.name,
        "Validation gate name",
      ),
    required:
      input.required ??
      true,
    status:
      "pending",
    command:
      input.command
        ?.trim() ||
      null,
    startedAt:
      null,
    completedAt:
      null,
    output:
      null,
    error:
      null,
  };
}

export function addFactoryValidationGate(
  pack:
    FactoryPack,
  input:
    CreateFactoryValidationGateInput,
  updatedAt?:
    string,
): FactoryPack {
  const gate =
    createFactoryValidationGate(
      pack.id,
      input,
    );

  if (
    pack.validationGates.some(
      (current) =>
        current.id ===
        gate.id,
    )
  ) {
    throw new FactoryError(
      `Factory validation gate already exists: ${gate.id}.`,
      {
        code:
          "INVALID_PACK",
        details: {
          packId:
            pack.id,
          gateId:
            gate.id,
        },
      },
    );
  }

  return {
    ...pack,
    validationGates: [
      ...pack.validationGates,
      gate,
    ],
    version:
      pack.version + 1,
    updatedAt:
      normalizeTimestamp(
        updatedAt,
      ),
  };
}

export function updateFactoryValidationGateStatus(
  pack:
    FactoryPack,
  gateId:
    FactoryValidationGateId,
  status:
    FactoryValidationGateStatus,
  options: {
    readonly updatedAt?: string;
    readonly output?: string;
    readonly error?:
      FactoryError | null;
  } = {},
): FactoryPack {
  const gate =
    pack.validationGates.find(
      (current) =>
        current.id ===
        gateId,
    );

  if (!gate) {
    throw new FactoryError(
      `Factory validation gate was not found: ${gateId}.`,
      {
        code:
          "VALIDATION_FAILED",
        details: {
          packId:
            pack.id,
          gateId,
        },
      },
    );
  }

  const timestamp =
    normalizeTimestamp(
      options.updatedAt,
    );

  const updated:
    FactoryValidationGate = {
    ...gate,
    status,
    startedAt:
      gate.startedAt ??
      (
        status ===
          "running"
          ? timestamp
          : null
      ),
    completedAt:
      status ===
        "passed" ||
      status ===
        "failed" ||
      status ===
        "skipped"
        ? timestamp
        : gate.completedAt,
    output:
      options.output ??
      gate.output,
    error:
      options.error
        ?.toSnapshot() ??
      null,
  };

  return {
    ...pack,
    validationGates:
      pack.validationGates.map(
        (current) =>
          current.id ===
          gateId
            ? updated
            : current,
      ),
    errors:
      options.error
        ? [
            ...pack.errors,
            options.error
              .toSnapshot(),
          ]
        : pack.errors,
    version:
      pack.version + 1,
    updatedAt:
      timestamp,
  };
}

export function isFactoryPackReadyForCompletion(
  pack:
    FactoryPack,
): boolean {
  const requiredGates =
    pack.validationGates.filter(
      (gate) =>
        gate.required,
    );

  return (
    pack.steps.length > 0 &&
    pack.steps.every(
      (step) =>
        step.status ===
          "succeeded" ||
        step.status ===
          "skipped",
    ) &&
    requiredGates.length > 0 &&
    requiredGates.every(
      (gate) =>
        gate.status ===
        "passed",
    )
  );
}

export async function executeFactoryOperation<
  TValue,
>(
  operation:
    () => Promise<TValue>,
  now:
    () => string =
      () =>
        new Date()
          .toISOString(),
): Promise<
  FactoryExecutionResult<TValue>
> {
  const startedAt =
    normalizeTimestamp(
      now(),
    );

  const startedMs =
    Date.parse(
      startedAt,
    );

  try {
    const value =
      await operation();

    const completedAt =
      normalizeTimestamp(
        now(),
      );

    const completedMs =
      Date.parse(
        completedAt,
      );

    return {
      success: true,
      value,
      error: null,
      startedAt,
      completedAt,
      durationMs:
        Math.max(
          0,
          completedMs -
          startedMs,
        ),
    };
  }
  catch (error: unknown) {
    const factoryError =
      error instanceof
        FactoryError
        ? error
        : new FactoryError(
            error instanceof Error
              ? error.message
              : "Factory execution failed.",
            {
              code:
                "EXECUTION_FAILED",
              cause:
                error,
            },
          );

    const completedAt =
      normalizeTimestamp(
        now(),
      );

    const completedMs =
      Date.parse(
        completedAt,
      );

    return {
      success: false,
      value: null,
      error:
        factoryError
          .toSnapshot(),
      startedAt,
      completedAt,
      durationMs:
        Math.max(
          0,
          completedMs -
          startedMs,
        ),
    };
  }
}
