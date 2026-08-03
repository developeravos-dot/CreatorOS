import {
  createFactoryBlueprint,
  summarizeFactoryBlueprint,
  validateFactoryBlueprint,
  type FactoryBlueprint,
  type FactoryBlueprintSummary,
} from "../blueprint";

import {
  createFactoryConfigurationForEnvironment,
  validateFactoryConfiguration,
  type FactoryConfiguration,
  type FactoryConfigurationOverride,
  type FactoryConfigurationValidationResult,
  type FactoryEnvironment,
} from "../configuration";

import {
  createFactoryPack,
  type FactoryPack,
  type FactoryPackType,
} from "../domain";

import {
  createFactoryExecutionPlan,
  summarizeFactoryExecutionPlan,
  validateFactoryExecutionPlan,
  type FactoryExecutionPlan,
  type FactoryExecutionPlanProgress,
  type FactoryExecutionPlanValidationResult,
} from "../execution";

import {
  createFactoryPackManifest,
  validateFactoryPackManifest,
  type FactoryManifestValidationResult,
  type FactoryPackManifest,
} from "../manifest";

import {
  createFactoryRegistry,
  summarizeFactoryRegistry,
  validateFactoryRegistry,
  type FactoryRegistry,
  type FactoryRegistrySummary,
  type FactoryRegistryValidationResult,
} from "../registry";

import {
  createDefaultFactoryValidationPipeline,
  summarizeFactoryValidationPipeline,
  validateFactoryValidationPipeline,
  type FactoryValidationPipeline,
  type FactoryValidationPipelineSummary,
  type FactoryValidationPipelineValidationResult,
} from "../validation";

export interface CreateFactoryFoundationInput {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly packType?: FactoryPackType;
  readonly environment?: FactoryEnvironment;
  readonly configuration?:
    FactoryConfigurationOverride;
  readonly createdAt?: string;
}

export interface FactoryFoundation {
  readonly schema:
    "creatoros.factory.foundation";
  readonly version:
    "1.0.0";
  readonly pack:
    FactoryPack;
  readonly manifest:
    FactoryPackManifest;
  readonly blueprint:
    FactoryBlueprint;
  readonly registry:
    FactoryRegistry;
  readonly executionPlan:
    FactoryExecutionPlan;
  readonly validationPipeline:
    FactoryValidationPipeline;
  readonly configuration:
    FactoryConfiguration;
  readonly createdAt: string;
}

export interface FactoryFoundationValidation {
  readonly valid: boolean;
  readonly configuration:
    FactoryConfigurationValidationResult;
  readonly manifest:
    FactoryManifestValidationResult;
  readonly blueprint:
    ReturnType<
      typeof validateFactoryBlueprint
    >;
  readonly registry:
    FactoryRegistryValidationResult;
  readonly executionPlan:
    FactoryExecutionPlanValidationResult;
  readonly validationPipeline:
    FactoryValidationPipelineValidationResult;
}

export interface FactoryFoundationSummary {
  readonly packId: string;
  readonly packStatus: string;
  readonly manifestVersion: string;
  readonly blueprint:
    FactoryBlueprintSummary;
  readonly registry:
    FactoryRegistrySummary;
  readonly execution:
    FactoryExecutionPlanProgress;
  readonly validation:
    FactoryValidationPipelineSummary;
  readonly environment:
    FactoryEnvironment;
  readonly valid: boolean;
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

export function createFactoryFoundation(
  input:
    CreateFactoryFoundationInput,
): FactoryFoundation {
  const createdAt =
    normalizeTimestamp(
      input.createdAt,
    );

  const pack =
    createFactoryPack({
      id:
        input.id,
      name:
        input.name,
      description:
        input.description,
      type:
        input.packType ??
        "foundation",
      createdAt,
      metadata: {
        factoryFoundation:
          true,
      },
    });

  const configuration =
    createFactoryConfigurationForEnvironment(
      input.environment ??
        "development",
      input.configuration ??
        {},
    );

  const manifest =
    createFactoryPackManifest({
      packId:
        pack.id,
      name:
        input.name,
      description:
        input.description,
      packType:
        pack.type,
      manifestVersion:
        "1.0.0",
      capabilities: [
        "factory-domain",
        "pack-manifest",
        "blueprint-models",
        "factory-registries",
        "execution-planning",
        "validation-pipeline",
        "factory-configuration",
      ],
      validationGates: [
        {
          id: "vitest",
          type: "vitest",
          name: "Vitest",
          required: true,
          command:
            "pnpm exec vitest run",
        },
        {
          id: "typescript",
          type:
            "typescript",
          name:
            "TypeScript",
          required: true,
          command:
            "pnpm exec tsc --noEmit -p tsconfig.json",
        },
        {
          id: "build",
          type: "build",
          name:
            "Production Build",
          required: true,
          command:
            "pnpm build",
        },
        {
          id: "encoding",
          type:
            "encoding",
          name:
            "Encoding Scan",
          required: true,
          command: null,
        },
        {
          id: "git-diff",
          type:
            "git-diff",
          name:
            "Git Diff",
          required: true,
          command:
            "git diff --check",
        },
      ],
      metadata: {
        branch:
          configuration.git
            .branchPrefix,
        tags: [
          "factory",
          "foundation",
          "f0",
        ],
      },
      createdAt,
    });

  const blueprint =
    createFactoryBlueprint({
      id:
        `${input.id}-blueprint`,
      packId:
        pack.id,
      name:
        `${input.name} Blueprint`,
      description:
        "Factory Foundation integration blueprint.",
      createdAt,
    });

  const registry =
    createFactoryRegistry(
      createdAt,
    );

  const executionPlan =
    createFactoryExecutionPlan({
      id:
        `${input.id}-execution`,
      packId:
        pack.id,
      name:
        `${input.name} Execution Plan`,
      description:
        "Factory Foundation execution plan.",
      createdAt,
    });

  const validationPipeline =
    createDefaultFactoryValidationPipeline({
      id:
        `${input.id}-validation`,
      packId:
        pack.id,
      name:
        `${input.name} Validation Pipeline`,
      description:
        "Factory Foundation quality gates.",
      createdAt,
      mode:
        configuration.validation
          .failFast
          ? "fail-fast"
          : "continue-on-error",
    });

  return {
    schema:
      "creatoros.factory.foundation",
    version:
      "1.0.0",
    pack,
    manifest,
    blueprint,
    registry,
    executionPlan,
    validationPipeline,
    configuration,
    createdAt,
  };
}

export function validateFactoryFoundation(
  foundation:
    FactoryFoundation,
): FactoryFoundationValidation {
  const configuration =
    validateFactoryConfiguration(
      foundation.configuration,
    );

  const manifest =
    validateFactoryPackManifest(
      foundation.manifest,
    );

  const blueprint =
    validateFactoryBlueprint(
      foundation.blueprint,
    );

  const registry =
    validateFactoryRegistry(
      foundation.registry,
    );

  const executionPlan =
    validateFactoryExecutionPlan(
      foundation.executionPlan,
    );

  const validationPipeline =
    validateFactoryValidationPipeline(
      foundation.validationPipeline,
    );

  return {
    valid:
      configuration.valid &&
      manifest.valid &&
      blueprint.valid &&
      registry.valid &&
      executionPlan.valid &&
      validationPipeline.valid,
    configuration,
    manifest,
    blueprint,
    registry,
    executionPlan,
    validationPipeline,
  };
}

export function summarizeFactoryFoundation(
  foundation:
    FactoryFoundation,
): FactoryFoundationSummary {
  return {
    packId:
      foundation.pack.id,
    packStatus:
      foundation.pack.status,
    manifestVersion:
      foundation.manifest
        .manifestVersion,
    blueprint:
      summarizeFactoryBlueprint(
        foundation.blueprint,
      ),
    registry:
      summarizeFactoryRegistry(
        foundation.registry,
      ),
    execution:
      summarizeFactoryExecutionPlan(
        foundation.executionPlan,
      ),
    validation:
      summarizeFactoryValidationPipeline(
        foundation.validationPipeline,
      ),
    environment:
      foundation.configuration
        .environment,
    valid:
      validateFactoryFoundation(
        foundation,
      ).valid,
  };
}
