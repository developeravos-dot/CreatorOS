import {
  FactoryError,
  createFactoryPackId,
} from "../domain";

import type {
  CreateFactoryPackManifestInput,
  FactoryManifestDependency,
  FactoryManifestInput,
  FactoryManifestMetadata,
  FactoryManifestOutput,
  FactoryManifestValidationGate,
  FactoryManifestValidationIssue,
  FactoryManifestValidationResult,
  FactoryManifestVersion,
  FactoryPackManifest,
} from "./factory-manifest-types";

const DEFAULT_SCHEMA_VERSION:
  FactoryManifestVersion =
  "1.0.0";

const DEFAULT_MANIFEST_VERSION:
  FactoryManifestVersion =
  "1.0.0";

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

function normalizeStringList(
  values:
    readonly string[] =
      [],
): readonly string[] {
  return [
    ...new Set(
      values
        .map(
          (value) =>
            value.trim(),
        )
        .filter(Boolean),
    ),
  ];
}

function normalizeMetadata(
  metadata:
    Partial<
      FactoryManifestMetadata
    > = {},
): FactoryManifestMetadata {
  return {
    author:
      metadata.author
        ?.trim() ||
      null,
    team:
      metadata.team
        ?.trim() ||
      null,
    repository:
      metadata.repository
        ?.trim() ||
      null,
    branch:
      metadata.branch
        ?.trim() ||
      null,
    tags:
      normalizeStringList(
        metadata.tags,
      ),
    labels:
      metadata.labels ??
      {},
  };
}

function assertUniqueIds(
  values:
    readonly {
      readonly id: string;
    }[],
  collectionName: string,
): void {
  const ids =
    new Set<string>();

  for (const value of values) {
    const id =
      normalizeText(
        value.id,
        `${collectionName} id`,
      );

    if (ids.has(id)) {
      throw new FactoryError(
        `Duplicate ${collectionName} id: ${id}.`,
        {
          code:
            "INVALID_PACK",
          details: {
            collectionName,
            id,
          },
        },
      );
    }

    ids.add(id);
  }
}

export function createFactoryPackManifest(
  input:
    CreateFactoryPackManifestInput,
): FactoryPackManifest {
  const timestamp =
    normalizeTimestamp(
      input.createdAt,
    );

  const dependencies =
    input.dependencies ??
    [];

  const inputs =
    input.inputs ??
    [];

  const outputs =
    input.outputs ??
    [];

  const validationGates =
    input.validationGates ??
    [];

  assertUniqueIds(
    dependencies,
    "dependency",
  );

  assertUniqueIds(
    inputs,
    "input",
  );

  assertUniqueIds(
    outputs,
    "output",
  );

  assertUniqueIds(
    validationGates,
    "validation gate",
  );

  return {
    schema:
      "creatoros.factory.pack-manifest",
    schemaVersion:
      input.schemaVersion ??
      DEFAULT_SCHEMA_VERSION,
    packId:
      createFactoryPackId(
        input.packId,
      ),
    name:
      normalizeText(
        input.name,
        "Manifest name",
      ),
    description:
      input.description
        ?.trim() ??
      "",
    packType:
      input.packType,
    manifestVersion:
      input.manifestVersion ??
      DEFAULT_MANIFEST_VERSION,
    capabilities:
      normalizeStringList(
        input.capabilities,
      ),
    dependencies:
      dependencies.map(
        normalizeFactoryManifestDependency,
      ),
    inputs:
      inputs.map(
        normalizeFactoryManifestInput,
      ),
    outputs:
      outputs.map(
        normalizeFactoryManifestOutput,
      ),
    validationGates:
      validationGates.map(
        normalizeFactoryManifestValidationGate,
      ),
    metadata:
      normalizeMetadata(
        input.metadata,
      ),
    createdAt:
      timestamp,
    updatedAt:
      timestamp,
  };
}

export function normalizeFactoryManifestDependency(
  dependency:
    FactoryManifestDependency,
): FactoryManifestDependency {
  return {
    ...dependency,
    id:
      normalizeText(
        dependency.id,
        "Dependency id",
      ),
    description:
      dependency.description
        .trim(),
    version:
      dependency.version
        ?.trim() ||
      null,
    source:
      dependency.source
        ?.trim() ||
      null,
  };
}

export function normalizeFactoryManifestInput(
  input:
    FactoryManifestInput,
): FactoryManifestInput {
  return {
    ...input,
    id:
      normalizeText(
        input.id,
        "Input id",
      ),
    label:
      normalizeText(
        input.label,
        "Input label",
      ),
    description:
      input.description
        .trim(),
    options:
      input.options ??
      [],
  };
}

export function normalizeFactoryManifestOutput(
  output:
    FactoryManifestOutput,
): FactoryManifestOutput {
  return {
    ...output,
    id:
      normalizeText(
        output.id,
        "Output id",
      ),
    path:
      output.path
        ?.trim() ||
      null,
    description:
      output.description
        .trim(),
  };
}

export function normalizeFactoryManifestValidationGate(
  gate:
    FactoryManifestValidationGate,
): FactoryManifestValidationGate {
  return {
    ...gate,
    id:
      normalizeText(
        gate.id,
        "Validation gate id",
      ),
    name:
      normalizeText(
        gate.name,
        "Validation gate name",
      ),
    command:
      gate.command
        ?.trim() ||
      null,
  };
}

export function updateFactoryPackManifest(
  manifest:
    FactoryPackManifest,
  patch:
    Partial<
      Pick<
        FactoryPackManifest,
        | "name"
        | "description"
        | "capabilities"
        | "dependencies"
        | "inputs"
        | "outputs"
        | "validationGates"
        | "metadata"
      >
    >,
  updatedAt?:
    string,
): FactoryPackManifest {
  return createFactoryPackManifest({
    packId:
      manifest.packId,
    name:
      patch.name ??
      manifest.name,
    description:
      patch.description ??
      manifest.description,
    packType:
      manifest.packType,
    schemaVersion:
      manifest.schemaVersion,
    manifestVersion:
      manifest.manifestVersion,
    capabilities:
      patch.capabilities ??
      manifest.capabilities,
    dependencies:
      patch.dependencies ??
      manifest.dependencies,
    inputs:
      patch.inputs ??
      manifest.inputs,
    outputs:
      patch.outputs ??
      manifest.outputs,
    validationGates:
      patch.validationGates ??
      manifest.validationGates,
    metadata:
      patch.metadata ??
      manifest.metadata,
    createdAt:
      manifest.createdAt,
  }) satisfies FactoryPackManifest & {
    readonly updatedAt: string;
  } as FactoryPackManifest;
}

export function validateFactoryPackManifest(
  manifest:
    FactoryPackManifest,
): FactoryManifestValidationResult {
  const issues:
    FactoryManifestValidationIssue[] = [];

  if (
    manifest.schema !==
    "creatoros.factory.pack-manifest"
  ) {
    issues.push({
      code:
        "INVALID_MANIFEST",
      path:
        "schema",
      message:
        "Unsupported Factory manifest schema.",
    });
  }

  const collections = [
    {
      name:
        "dependencies",
      values:
        manifest.dependencies,
    },
    {
      name:
        "inputs",
      values:
        manifest.inputs,
    },
    {
      name:
        "outputs",
      values:
        manifest.outputs,
    },
    {
      name:
        "validationGates",
      values:
        manifest.validationGates,
    },
  ] as const;

  for (
    const collection of
    collections
  ) {
    const seen =
      new Set<string>();

    for (
      const value of
      collection.values
    ) {
      if (seen.has(value.id)) {
        issues.push({
          code:
            "DUPLICATE_ID",
          path:
            `${collection.name}.${value.id}`,
          message:
            `Duplicate identifier: ${value.id}.`,
        });
      }

      seen.add(value.id);
    }
  }

  for (
    const requiredGateType of
    REQUIRED_GATE_TYPES
  ) {
    const exists =
      manifest.validationGates
        .some(
          (gate) =>
            gate.required &&
            gate.type ===
            requiredGateType,
        );

    if (!exists) {
      issues.push({
        code:
          "MISSING_REQUIRED_GATE",
        path:
          "validationGates",
        message:
          `Required validation gate is missing: ${requiredGateType}.`,
      });
    }
  }

  for (
    const dependency of
    manifest.dependencies
  ) {
    if (
      dependency.requirement ===
        "required" &&
      !dependency.source &&
      !dependency.version
    ) {
      issues.push({
        code:
          "INVALID_DEPENDENCY",
        path:
          `dependencies.${dependency.id}`,
        message:
          "Required dependencies need a version or source.",
      });
    }
  }

  for (
    const output of
    manifest.outputs
  ) {
    if (
      output.required &&
      (
        output.type === "file" ||
        output.type === "directory"
      ) &&
      !output.path
    ) {
      issues.push({
        code:
          "INVALID_OUTPUT",
        path:
          `outputs.${output.id}`,
        message:
          "Required file and directory outputs need a path.",
      });
    }
  }

  for (
    const input of
    manifest.inputs
  ) {
    if (
      input.type === "enum" &&
      input.options.length === 0
    ) {
      issues.push({
        code:
          "INVALID_INPUT",
        path:
          `inputs.${input.id}`,
        message:
          "Enum inputs require at least one option.",
      });
    }
  }

  return {
    valid:
      issues.length === 0,
    issues,
  };
}

export function getFactoryManifestRequiredOutputs(
  manifest:
    FactoryPackManifest,
): readonly FactoryManifestOutput[] {
  return manifest.outputs
    .filter(
      (output) =>
        output.required,
    );
}

export function getFactoryManifestMissingOutputs(
  manifest:
    FactoryPackManifest,
): readonly FactoryManifestOutput[] {
  return manifest.outputs
    .filter(
      (output) =>
        output.required &&
        !output.generated,
    );
}

export function isFactoryManifestReleaseReady(
  manifest:
    FactoryPackManifest,
): boolean {
  return (
    validateFactoryPackManifest(
      manifest,
    ).valid &&
    getFactoryManifestMissingOutputs(
      manifest,
    ).length === 0
  );
}
