import {
  FactoryError,
  createFactoryValidationGateId,
} from "../domain";

import type {
  CreateFactoryValidationGateDefinitionInput,
  CreateFactoryValidationPipelineInput,
  FactoryValidationGateDefinition,
  FactoryValidationGateResult,
  FactoryValidationPipeline,
  FactoryValidationPipelineId,
  FactoryValidationPipelineStatus,
  FactoryValidationPipelineSummary,
  FactoryValidationPipelineValidationIssue,
  FactoryValidationPipelineValidationResult,
  FactoryValidationRunOptions,
} from "./factory-validation-types";

const REQUIRED_GATE_TYPES = [
  "vitest",
  "typescript",
  "build",
  "encoding",
  "git-diff",
] as const;

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

function timestampToMilliseconds(
  value: string,
): number {
  const parsed =
    Date.parse(value);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

export function createFactoryValidationPipelineId(
  value: string,
): FactoryValidationPipelineId {
  return normalizeText(
    value,
    "Validation pipeline id",
  ) as FactoryValidationPipelineId;
}

export function createFactoryValidationPipeline(
  input:
    CreateFactoryValidationPipelineInput,
): FactoryValidationPipeline {
  const timestamp =
    normalizeTimestamp(
      input.createdAt,
    );

  return {
    id:
      createFactoryValidationPipelineId(
        input.id,
      ),
    packId:
      input.packId,
    name:
      normalizeText(
        input.name,
        "Validation pipeline name",
      ),
    description:
      input.description
        ?.trim() ??
      "",
    status: "draft",
    mode:
      input.mode ??
      "fail-fast",
    version: 1,
    gates: [],
    results: [],
    createdAt:
      timestamp,
    updatedAt:
      timestamp,
    startedAt: null,
    completedAt: null,
    metadata:
      input.metadata ??
      {},
  };
}

export function createFactoryValidationGateDefinition(
  input:
    CreateFactoryValidationGateDefinitionInput,
): FactoryValidationGateDefinition {
  if (
    !Number.isInteger(
      input.order,
    ) ||
    input.order < 0
  ) {
    throw new FactoryError(
      "Validation gate order must be a non-negative integer.",
      {
        code:
          "INVALID_PACK",
        details: {
          gateId:
            input.id,
          order:
            input.order,
        },
      },
    );
  }

  const timeoutMs =
    input.timeoutMs ??
    120000;

  if (
    !Number.isInteger(
      timeoutMs,
    ) ||
    timeoutMs < 1
  ) {
    throw new FactoryError(
      "Validation gate timeout must be a positive integer.",
      {
        code:
          "INVALID_PACK",
        details: {
          gateId:
            input.id,
          timeoutMs,
        },
      },
    );
  }

  return {
    id:
      createFactoryValidationGateId(
        input.id,
      ),
    packId:
      input.packId,
    type:
      input.type,
    name:
      normalizeText(
        input.name,
        "Validation gate name",
      ),
    description:
      input.description
        ?.trim() ??
      "",
    command:
      input.command
        ?.trim() ||
      null,
    workingDirectory:
      input.workingDirectory
        ?.trim() ||
      null,
    required:
      input.required ??
      true,
    enabled:
      input.enabled ??
      true,
    timeoutMs,
    order:
      input.order,
    metadata:
      input.metadata ??
      {},
  };
}

export function addFactoryValidationPipelineGate(
  pipeline:
    FactoryValidationPipeline,
  input:
    CreateFactoryValidationGateDefinitionInput,
  updatedAt?:
    string,
): FactoryValidationPipeline {
  const gate =
    createFactoryValidationGateDefinition(
      input,
    );

  if (
    pipeline.gates.some(
      (current) =>
        current.id ===
        gate.id,
    )
  ) {
    throw new FactoryError(
      `Validation pipeline gate already exists: ${gate.id}.`,
      {
        code:
          "INVALID_PACK",
        details: {
          pipelineId:
            pipeline.id,
          gateId:
            gate.id,
        },
      },
    );
  }

  if (
    gate.packId !==
    pipeline.packId
  ) {
    throw new FactoryError(
      "Validation gate and pipeline must belong to the same Factory pack.",
      {
        code:
          "INVALID_PACK",
        details: {
          pipelinePackId:
            pipeline.packId,
          gatePackId:
            gate.packId,
        },
      },
    );
  }

  return {
    ...pipeline,
    gates: [
      ...pipeline.gates,
      gate,
    ].sort(
      (left, right) =>
        left.order -
        right.order,
    ),
    version:
      pipeline.version + 1,
    updatedAt:
      normalizeTimestamp(
        updatedAt,
      ),
  };
}

export function createDefaultFactoryValidationPipeline(
  input:
    CreateFactoryValidationPipelineInput,
): FactoryValidationPipeline {
  let pipeline =
    createFactoryValidationPipeline(
      input,
    );

  const defaults:
    readonly CreateFactoryValidationGateDefinitionInput[] = [
    {
      id: "vitest",
      packId:
        input.packId,
      type: "vitest",
      name:
        "Vitest",
      description:
        "Run Factory unit and integration tests.",
      command:
        "pnpm exec vitest run",
      workingDirectory:
        "apps/web",
      required: true,
      order: 10,
      timeoutMs:
        300000,
    },
    {
      id: "typescript",
      packId:
        input.packId,
      type:
        "typescript",
      name:
        "TypeScript",
      description:
        "Run the TypeScript compiler without emitting files.",
      command:
        "pnpm exec tsc --noEmit -p tsconfig.json",
      workingDirectory:
        "apps/web",
      required: true,
      order: 20,
      timeoutMs:
        300000,
    },
    {
      id: "build",
      packId:
        input.packId,
      type: "build",
      name:
        "Production Build",
      description:
        "Create the production application build.",
      command:
        "pnpm build",
      workingDirectory:
        "apps/web",
      required: true,
      order: 30,
      timeoutMs:
        300000,
    },
    {
      id: "encoding",
      packId:
        input.packId,
      type:
        "encoding",
      name:
        "Encoding Scan",
      description:
        "Scan generated source files for common encoding corruption.",
      command: null,
      workingDirectory: null,
      required: true,
      order: 40,
      timeoutMs:
        120000,
    },
    {
      id: "git-diff",
      packId:
        input.packId,
      type:
        "git-diff",
      name:
        "Git Diff",
      description:
        "Validate the Git working diff.",
      command:
        "git diff --check",
      workingDirectory:
        null,
      required: true,
      order: 50,
      timeoutMs:
        120000,
    },
  ];

  for (
    const gate of defaults
  ) {
    pipeline =
      addFactoryValidationPipelineGate(
        pipeline,
        gate,
      );
  }

  return pipeline;
}

export function transitionFactoryValidationPipeline(
  pipeline:
    FactoryValidationPipeline,
  status:
    FactoryValidationPipelineStatus,
  updatedAt?:
    string,
): FactoryValidationPipeline {
  if (
    pipeline.status ===
    status
  ) {
    return pipeline;
  }

  const allowed:
    Readonly<
      Record<
        FactoryValidationPipelineStatus,
        readonly FactoryValidationPipelineStatus[]
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
      "passed",
      "failed",
      "cancelled",
    ],

    passed: [],

    failed: [
      "ready",
      "cancelled",
    ],

    cancelled: [],
  };

  if (
    !allowed[
      pipeline.status
    ].includes(status)
  ) {
    throw new FactoryError(
      `Cannot transition validation pipeline from ${pipeline.status} to ${status}.`,
      {
        code:
          "INVALID_STATUS_TRANSITION",
        details: {
          pipelineId:
            pipeline.id,
          currentStatus:
            pipeline.status,
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
    ...pipeline,
    status,
    version:
      pipeline.version + 1,
    updatedAt:
      timestamp,
    startedAt:
      pipeline.startedAt ??
      (
        status === "running"
          ? timestamp
          : null
      ),
    completedAt:
      status === "passed" ||
      status === "failed" ||
      status === "cancelled"
        ? timestamp
        : pipeline.completedAt,
  };
}

async function runFactoryValidationGate(
  gate:
    FactoryValidationGateDefinition,
  options:
    FactoryValidationRunOptions,
): Promise<
  FactoryValidationGateResult
> {
  const now =
    options.now ??
    (() =>
      new Date()
        .toISOString());

  const startedAt =
    normalizeTimestamp(
      now(),
    );

  if (!gate.enabled) {
    const completedAt =
      normalizeTimestamp(
        now(),
      );

    return {
      gateId:
        gate.id,
      gateType:
        gate.type,
      name:
        gate.name,
      required:
        gate.required,
      status:
        "skipped",
      command:
        gate.command,
      exitCode: null,
      stdout: "",
      stderr: "",
      startedAt,
      completedAt,
      durationMs:
        Math.max(
          0,
          timestampToMilliseconds(
            completedAt,
          ) -
          timestampToMilliseconds(
            startedAt,
          ),
        ),
      error: null,
    };
  }

  try {
    const commandResult =
      await options.runner({
        gate,
        signal:
          options.signal ??
          null,
      });

    const completedAt =
      normalizeTimestamp(
        now(),
      );

    const passed =
      commandResult.exitCode ===
      0;

    const error =
      passed
        ? null
        : new FactoryError(
            `Validation gate failed: ${gate.name}.`,
            {
              code:
                "VALIDATION_FAILED",
              recoverable:
                true,
              details: {
                gateId:
                  gate.id,
                exitCode:
                  commandResult.exitCode,
                stderr:
                  commandResult.stderr,
              },
              occurredAt:
                completedAt,
            },
          ).toSnapshot();

    return {
      gateId:
        gate.id,
      gateType:
        gate.type,
      name:
        gate.name,
      required:
        gate.required,
      status:
        passed
          ? "passed"
          : "failed",
      command:
        gate.command,
      exitCode:
        commandResult.exitCode,
      stdout:
        commandResult.stdout,
      stderr:
        commandResult.stderr,
      startedAt,
      completedAt,
      durationMs:
        Math.max(
          0,
          timestampToMilliseconds(
            completedAt,
          ) -
          timestampToMilliseconds(
            startedAt,
          ),
        ),
      error,
    };
  }
  catch (error: unknown) {
    const completedAt =
      normalizeTimestamp(
        now(),
      );

    const factoryError =
      error instanceof
        FactoryError
        ? error
        : new FactoryError(
            error instanceof Error
              ? error.message
              : `Validation gate execution failed: ${gate.name}.`,
            {
              code:
                "VALIDATION_FAILED",
              recoverable:
                true,
              details: {
                gateId:
                  gate.id,
              },
              cause:
                error,
              occurredAt:
                completedAt,
            },
          );

    return {
      gateId:
        gate.id,
      gateType:
        gate.type,
      name:
        gate.name,
      required:
        gate.required,
      status:
        "failed",
      command:
        gate.command,
      exitCode: null,
      stdout: "",
      stderr:
        factoryError.message,
      startedAt,
      completedAt,
      durationMs:
        Math.max(
          0,
          timestampToMilliseconds(
            completedAt,
          ) -
          timestampToMilliseconds(
            startedAt,
          ),
        ),
      error:
        factoryError
          .toSnapshot(),
    };
  }
}

export async function runFactoryValidationPipeline(
  pipeline:
    FactoryValidationPipeline,
  options:
    FactoryValidationRunOptions,
): Promise<
  FactoryValidationPipeline
> {
  const now =
    options.now ??
    (() =>
      new Date()
        .toISOString());

  const validation =
    validateFactoryValidationPipeline(
      pipeline,
    );

  if (!validation.valid) {
    throw new FactoryError(
      "Factory validation pipeline is invalid.",
      {
        code:
          "VALIDATION_FAILED",
        details: {
          pipelineId:
            pipeline.id,
          issues:
            validation.issues,
        },
      },
    );
  }

  let working =
    pipeline.status ===
    "draft"
      ? transitionFactoryValidationPipeline(
          transitionFactoryValidationPipeline(
            pipeline,
            "ready",
            now(),
          ),
          "running",
          now(),
        )
      : pipeline.status ===
        "ready"
        ? transitionFactoryValidationPipeline(
            pipeline,
            "running",
            now(),
          )
        : pipeline;

  if (
    working.status !==
    "running"
  ) {
    throw new FactoryError(
      "Validation pipeline must be ready or draft before execution.",
      {
        code:
          "VALIDATION_FAILED",
        details: {
          pipelineId:
            working.id,
          status:
            working.status,
        },
      },
    );
  }

  const results:
    FactoryValidationGateResult[] = [];

  for (
    const gate of
    working.gates
  ) {
    if (
      options.signal
        ?.aborted
    ) {
      working =
        transitionFactoryValidationPipeline(
          {
            ...working,
            results,
          },
          "cancelled",
          now(),
        );

      return working;
    }

    const result =
      await runFactoryValidationGate(
        gate,
        options,
      );

    results.push(result);

    if (
      result.status ===
        "failed" &&
      pipeline.mode ===
        "fail-fast"
    ) {
      break;
    }
  }

  const requiredFailure =
    results.some(
      (result) =>
        result.required &&
        result.status ===
          "failed",
    );

  const unexecutedRequired =
    working.gates.some(
      (gate) =>
        gate.enabled &&
        gate.required &&
        !results.some(
          (result) =>
            result.gateId ===
            gate.id,
        ),
    );

  const finalStatus:
    FactoryValidationPipelineStatus =
    requiredFailure ||
    unexecutedRequired
      ? "failed"
      : "passed";

  working = {
    ...working,
    results,
    version:
      working.version + 1,
    updatedAt:
      normalizeTimestamp(
        now(),
      ),
  };

  return transitionFactoryValidationPipeline(
    working,
    finalStatus,
    now(),
  );
}

export function validateFactoryValidationPipeline(
  pipeline:
    FactoryValidationPipeline,
): FactoryValidationPipelineValidationResult {
  const issues:
    FactoryValidationPipelineValidationIssue[] = [];

  if (
    pipeline.gates.length ===
    0
  ) {
    issues.push({
      code:
        "NO_GATES",
      path: "gates",
      message:
        "Validation pipeline must contain at least one gate.",
    });
  }

  const ids =
    new Set<string>();

  for (
    const gate of
    pipeline.gates
  ) {
    if (
      ids.has(
        gate.id,
      )
    ) {
      issues.push({
        code:
          "DUPLICATE_GATE",
        path:
          `gates.${gate.id}`,
        message:
          `Duplicate validation gate: ${gate.id}.`,
      });
    }

    ids.add(
      gate.id,
    );

    if (
      !Number.isInteger(
        gate.order,
      ) ||
      gate.order < 0
    ) {
      issues.push({
        code:
          "INVALID_ORDER",
        path:
          `gates.${gate.id}.order`,
        message:
          "Validation gate order must be a non-negative integer.",
      });
    }

    if (
      !Number.isInteger(
        gate.timeoutMs,
      ) ||
      gate.timeoutMs < 1
    ) {
      issues.push({
        code:
          "INVALID_TIMEOUT",
        path:
          `gates.${gate.id}.timeoutMs`,
        message:
          "Validation gate timeout must be a positive integer.",
      });
    }

    if (
      gate.enabled &&
      (
        gate.type === "vitest" ||
        gate.type ===
          "typescript" ||
        gate.type === "eslint" ||
        gate.type === "build" ||
        gate.type ===
          "git-diff"
      ) &&
      !gate.command
    ) {
      issues.push({
        code:
          "MISSING_COMMAND",
        path:
          `gates.${gate.id}.command`,
        message:
          `Validation gate ${gate.id} requires a command.`,
      });
    }
  }

  for (
    const requiredType of
    REQUIRED_GATE_TYPES
  ) {
    const exists =
      pipeline.gates.some(
        (gate) =>
          gate.enabled &&
          gate.required &&
          gate.type ===
            requiredType,
      );

    if (!exists) {
      issues.push({
        code:
          "MISSING_REQUIRED_GATE",
        path:
          "gates",
        message:
          `Required validation gate is missing: ${requiredType}.`,
      });
    }
  }

  return {
    valid:
      issues.length === 0,
    issues,
  };
}

export function summarizeFactoryValidationPipeline(
  pipeline:
    FactoryValidationPipeline,
): FactoryValidationPipelineSummary {
  const enabled =
    pipeline.gates.filter(
      (gate) =>
        gate.enabled,
    );

  const required =
    enabled.filter(
      (gate) =>
        gate.required,
    );

  const passed =
    pipeline.results.filter(
      (result) =>
        result.status ===
        "passed",
    );

  const failed =
    pipeline.results.filter(
      (result) =>
        result.status ===
        "failed",
    );

  const skipped =
    pipeline.results.filter(
      (result) =>
        result.status ===
        "skipped",
    );

  const requiredPassed =
    passed.filter(
      (result) =>
        result.required,
    );

  const requiredFailed =
    failed.filter(
      (result) =>
        result.required,
    );

  const releaseReady =
    required.length > 0 &&
    requiredFailed.length === 0 &&
    required.every(
      (gate) =>
        pipeline.results.some(
          (result) =>
            result.gateId ===
              gate.id &&
            result.status ===
              "passed",
        ),
    );

  return {
    total:
      pipeline.gates.length,
    enabled:
      enabled.length,
    required:
      required.length,
    passed:
      passed.length,
    failed:
      failed.length,
    skipped:
      skipped.length,
    requiredPassed:
      requiredPassed.length,
    requiredFailed:
      requiredFailed.length,
    releaseReady,
  };
}

export function isFactoryValidationPipelineReleaseReady(
  pipeline:
    FactoryValidationPipeline,
): boolean {
  return (
    pipeline.status ===
      "passed" &&
    summarizeFactoryValidationPipeline(
      pipeline,
    ).releaseReady
  );
}
