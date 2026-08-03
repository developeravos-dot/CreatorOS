import {
  FactoryError,
} from "../domain";

import type {
  FactoryConfiguration,
  FactoryConfigurationOverride,
  FactoryConfigurationValidationIssue,
  FactoryConfigurationValidationResult,
  FactoryEnvironment,
  FactoryRetryConfiguration,
} from "./factory-configuration-types";

function normalizePath(
  value: string,
  fieldName: string,
): string {
  const normalized =
    value
      .trim()
      .replace(
        /\\/g,
        "/",
      )
      .replace(
        /\/+/g,
        "/",
      )
      .replace(
        /\/$/g,
        "",
      );

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

function normalizePrefix(
  value: string,
): string {
  return value
    .trim()
    .replace(
      /\s+/g,
      "-",
    );
}

export function createDefaultFactoryConfiguration(
  environment:
    FactoryEnvironment =
      "development",
): FactoryConfiguration {
  const production =
    environment ===
    "production";

  return {
    schema:
      "creatoros.factory.configuration",
    schemaVersion:
      "1.0.0",
    environment,
    paths: {
      repositoryRoot:
        ".",
      sourceRoot:
        "apps/web/src",
      factoryRoot:
        "apps/web/src/factory",
      templatesRoot:
        "apps/web/src/factory/templates",
      generatedRoot:
        "apps/web/src/generated",
      reportsRoot:
        ".factory/reports",
      backupsRoot:
        ".factory/backups",
      temporaryRoot:
        ".factory/temp",
    },
    runtime: {
      environment,
      dryRun:
        production,
      allowFileOverwrite:
        !production,
      allowFileDelete:
        false,
      allowGitOperations:
        !production,
      requireHumanApproval:
        true,
      parallelExecution:
        false,
      maxParallelSteps:
        1,
      logLevel:
        production
          ? "info"
          : "debug",
    },
    limits: {
      maximumFilesPerPack:
        500,
      maximumDirectoriesPerPack:
        100,
      maximumStepsPerPlan:
        250,
      maximumValidationGates:
        25,
      maximumGeneratedBytes:
        50_000_000,
      maximumExecutionDurationMs:
        1_800_000,
      maximumRepairAttempts:
        5,
    },
    retry: {
      enabled: true,
      maximumAttempts: 3,
      initialDelayMs:
        500,
      maximumDelayMs:
        10_000,
      backoff:
        "exponential",
      retryableErrorCodes: [
        "EXECUTION_FAILED",
        "VALIDATION_FAILED",
        "INTEGRATION_FAILED",
      ],
    },
    validation: {
      runTargetedTests:
        true,
      runFullTests:
        true,
      runTypeScript:
        true,
      runLint:
        false,
      runBuild:
        true,
      runEncodingScan:
        true,
      runGitDiffCheck:
        true,
      failFast:
        true,
      commandTimeoutMs:
        300_000,
    },
    git: {
      branchPrefix:
        "feature/",
      commitPrefix:
        "feat(factory):",
      tagPrefix:
        "factory-",
      requireCleanWorkingTree:
        true,
      stageExpectedFilesOnly:
        true,
      createCommit:
        true,
      createTag:
        false,
      pushChanges:
        false,
    },
    release: {
      createManifest:
        true,
      createReleaseNotes:
        true,
      createChangelog:
        true,
      requireStableTag:
        false,
      releaseChannel:
        production
          ? "stable"
          : "development",
    },
    metadata: {},
  };
}

export function mergeFactoryConfiguration(
  base:
    FactoryConfiguration,
  override:
    FactoryConfigurationOverride,
): FactoryConfiguration {
  const environment =
    override.environment ??
    base.environment;

  return {
    ...base,
    environment,
    paths: {
      ...base.paths,
      ...override.paths,
    },
    runtime: {
      ...base.runtime,
      ...override.runtime,
      environment:
        override.runtime
          ?.environment ??
        environment,
    },
    limits: {
      ...base.limits,
      ...override.limits,
    },
    retry: {
      ...base.retry,
      ...override.retry,
      retryableErrorCodes:
        override.retry
          ?.retryableErrorCodes ??
        base.retry
          .retryableErrorCodes,
    },
    validation: {
      ...base.validation,
      ...override.validation,
    },
    git: {
      ...base.git,
      ...override.git,
    },
    release: {
      ...base.release,
      ...override.release,
    },
    metadata: {
      ...base.metadata,
      ...override.metadata,
    },
  };
}

export function normalizeFactoryConfiguration(
  configuration:
    FactoryConfiguration,
): FactoryConfiguration {
  return {
    ...configuration,
    paths: {
      repositoryRoot:
        normalizePath(
          configuration.paths
            .repositoryRoot,
          "Repository root",
        ),
      sourceRoot:
        normalizePath(
          configuration.paths
            .sourceRoot,
          "Source root",
        ),
      factoryRoot:
        normalizePath(
          configuration.paths
            .factoryRoot,
          "Factory root",
        ),
      templatesRoot:
        normalizePath(
          configuration.paths
            .templatesRoot,
          "Templates root",
        ),
      generatedRoot:
        normalizePath(
          configuration.paths
            .generatedRoot,
          "Generated root",
        ),
      reportsRoot:
        normalizePath(
          configuration.paths
            .reportsRoot,
          "Reports root",
        ),
      backupsRoot:
        normalizePath(
          configuration.paths
            .backupsRoot,
          "Backups root",
        ),
      temporaryRoot:
        normalizePath(
          configuration.paths
            .temporaryRoot,
          "Temporary root",
        ),
    },
    git: {
      ...configuration.git,
      branchPrefix:
        normalizePrefix(
          configuration.git
            .branchPrefix,
        ),
      commitPrefix:
        configuration.git
          .commitPrefix
          .trim(),
      tagPrefix:
        normalizePrefix(
          configuration.git
            .tagPrefix,
        ),
    },
  };
}

function calculateRetryDelay(
  retry:
    FactoryRetryConfiguration,
  attempt: number,
): number {
  switch (
    retry.backoff
  ) {
    case "fixed":
      return retry
        .initialDelayMs;

    case "linear":
      return retry
        .initialDelayMs *
        attempt;

    case "exponential":
      return retry
        .initialDelayMs *
        2 **
          Math.max(
            0,
            attempt - 1,
          );
  }
}

export function getFactoryRetryDelay(
  configuration:
    FactoryConfiguration,
  attempt: number,
): number {
  if (
    !configuration
      .retry.enabled ||
    attempt < 1
  ) {
    return 0;
  }

  return Math.min(
    calculateRetryDelay(
      configuration.retry,
      attempt,
    ),
    configuration
      .retry.maximumDelayMs,
  );
}

export function shouldRetryFactoryError(
  configuration:
    FactoryConfiguration,
  errorCode: string,
  attempt: number,
): boolean {
  return (
    configuration
      .retry.enabled &&
    attempt <
      configuration
        .retry.maximumAttempts &&
    configuration
      .retry
      .retryableErrorCodes
      .includes(
        errorCode,
      )
  );
}

export function validateFactoryConfiguration(
  configuration:
    FactoryConfiguration,
): FactoryConfigurationValidationResult {
  const issues:
    FactoryConfigurationValidationIssue[] = [];

  for (
    const [
      key,
      value,
    ] of Object.entries(
      configuration.paths,
    )
  ) {
    if (
      typeof value !==
        "string" ||
      !value.trim()
    ) {
      issues.push({
        code:
          "INVALID_PATH",
        path:
          `paths.${key}`,
        message:
          `Factory path is invalid: ${key}.`,
      });
    }
  }

  for (
    const [
      key,
      value,
    ] of Object.entries(
      configuration.limits,
    )
  ) {
    if (
      !Number.isInteger(
        value,
      ) ||
      value < 1
    ) {
      issues.push({
        code:
          "INVALID_LIMIT",
        path:
          `limits.${key}`,
        message:
          `Factory execution limit must be a positive integer: ${key}.`,
      });
    }
  }

  if (
    !Number.isInteger(
      configuration
        .runtime
        .maxParallelSteps,
    ) ||
    configuration
      .runtime
      .maxParallelSteps <
      1
  ) {
    issues.push({
      code:
        "INVALID_LIMIT",
      path:
        "runtime.maxParallelSteps",
      message:
        "Maximum parallel steps must be a positive integer.",
    });
  }

  if (
    !Number.isInteger(
      configuration
        .retry
        .maximumAttempts,
    ) ||
    configuration
      .retry
      .maximumAttempts <
      1
  ) {
    issues.push({
      code:
        "INVALID_RETRY",
      path:
        "retry.maximumAttempts",
      message:
        "Retry maximum attempts must be a positive integer.",
    });
  }

  if (
    configuration
      .retry
      .initialDelayMs <
      0 ||
    configuration
      .retry
      .maximumDelayMs <
      configuration
        .retry
        .initialDelayMs
  ) {
    issues.push({
      code:
        "INVALID_RETRY",
      path:
        "retry",
      message:
        "Retry delay limits are invalid.",
    });
  }

  if (
    !Number.isInteger(
      configuration
        .validation
        .commandTimeoutMs,
    ) ||
    configuration
      .validation
      .commandTimeoutMs <
      1
  ) {
    issues.push({
      code:
        "INVALID_TIMEOUT",
      path:
        "validation.commandTimeoutMs",
      message:
        "Validation command timeout must be a positive integer.",
    });
  }

  if (
    configuration
      .environment ===
      "production"
  ) {
    if (
      configuration
        .runtime
        .allowFileDelete
    ) {
      issues.push({
        code:
          "UNSAFE_PRODUCTION_SETTING",
        path:
          "runtime.allowFileDelete",
        message:
          "Automatic file deletion cannot be enabled in production.",
      });
    }

    if (
      !configuration
        .runtime
        .requireHumanApproval
    ) {
      issues.push({
        code:
          "UNSAFE_PRODUCTION_SETTING",
        path:
          "runtime.requireHumanApproval",
        message:
          "Human approval is required in production.",
      });
    }

    if (
      configuration
        .git
        .pushChanges
    ) {
      issues.push({
        code:
          "UNSAFE_PRODUCTION_SETTING",
        path:
          "git.pushChanges",
        message:
          "Automatic Git push cannot be enabled in production.",
      });
    }
  }

  if (
    !configuration
      .git
      .branchPrefix
      .trim()
  ) {
    issues.push({
      code:
        "INVALID_GIT_SETTING",
      path:
        "git.branchPrefix",
      message:
        "Git branch prefix is required.",
    });
  }

  if (
    configuration
      .git
      .createTag &&
    !configuration
      .git
      .createCommit
  ) {
    issues.push({
      code:
        "INVALID_GIT_SETTING",
      path:
        "git.createTag",
      message:
        "Factory cannot create a tag without creating a commit.",
    });
  }

  return {
    valid:
      issues.length === 0,
    issues,
  };
}

export function assertValidFactoryConfiguration(
  configuration:
    FactoryConfiguration,
): FactoryConfiguration {
  const normalized =
    normalizeFactoryConfiguration(
      configuration,
    );

  const validation =
    validateFactoryConfiguration(
      normalized,
    );

  if (!validation.valid) {
    throw new FactoryError(
      "Factory configuration is invalid.",
      {
        code:
          "INVALID_PACK",
        details: {
          issues:
            validation.issues,
        },
      },
    );
  }

  return normalized;
}

export function createFactoryConfigurationForEnvironment(
  environment:
    FactoryEnvironment,
  override:
    FactoryConfigurationOverride =
      {},
): FactoryConfiguration {
  return assertValidFactoryConfiguration(
    mergeFactoryConfiguration(
      createDefaultFactoryConfiguration(
        environment,
      ),
      {
        ...override,
        environment,
      },
    ),
  );
}
