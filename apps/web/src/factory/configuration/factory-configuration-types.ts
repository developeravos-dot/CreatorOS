export type FactoryEnvironment =
  | "development"
  | "test"
  | "staging"
  | "production";

export type FactoryLogLevel =
  | "debug"
  | "info"
  | "warning"
  | "error";

export type FactoryRetryBackoff =
  | "fixed"
  | "linear"
  | "exponential";

export interface FactoryPathConfiguration {
  readonly repositoryRoot: string;
  readonly sourceRoot: string;
  readonly factoryRoot: string;
  readonly templatesRoot: string;
  readonly generatedRoot: string;
  readonly reportsRoot: string;
  readonly backupsRoot: string;
  readonly temporaryRoot: string;
}

export interface FactoryRuntimeConfiguration {
  readonly environment:
    FactoryEnvironment;
  readonly dryRun: boolean;
  readonly allowFileOverwrite: boolean;
  readonly allowFileDelete: boolean;
  readonly allowGitOperations: boolean;
  readonly requireHumanApproval: boolean;
  readonly parallelExecution: boolean;
  readonly maxParallelSteps: number;
  readonly logLevel:
    FactoryLogLevel;
}

export interface FactoryExecutionLimitConfiguration {
  readonly maximumFilesPerPack: number;
  readonly maximumDirectoriesPerPack: number;
  readonly maximumStepsPerPlan: number;
  readonly maximumValidationGates: number;
  readonly maximumGeneratedBytes: number;
  readonly maximumExecutionDurationMs: number;
  readonly maximumRepairAttempts: number;
}

export interface FactoryRetryConfiguration {
  readonly enabled: boolean;
  readonly maximumAttempts: number;
  readonly initialDelayMs: number;
  readonly maximumDelayMs: number;
  readonly backoff:
    FactoryRetryBackoff;
  readonly retryableErrorCodes:
    readonly string[];
}

export interface FactoryValidationConfiguration {
  readonly runTargetedTests: boolean;
  readonly runFullTests: boolean;
  readonly runTypeScript: boolean;
  readonly runLint: boolean;
  readonly runBuild: boolean;
  readonly runEncodingScan: boolean;
  readonly runGitDiffCheck: boolean;
  readonly failFast: boolean;
  readonly commandTimeoutMs: number;
}

export interface FactoryGitConfiguration {
  readonly branchPrefix: string;
  readonly commitPrefix: string;
  readonly tagPrefix: string;
  readonly requireCleanWorkingTree: boolean;
  readonly stageExpectedFilesOnly: boolean;
  readonly createCommit: boolean;
  readonly createTag: boolean;
  readonly pushChanges: boolean;
}

export interface FactoryReleaseConfiguration {
  readonly createManifest: boolean;
  readonly createReleaseNotes: boolean;
  readonly createChangelog: boolean;
  readonly requireStableTag: boolean;
  readonly releaseChannel:
    | "development"
    | "preview"
    | "stable";
}

export interface FactoryConfiguration {
  readonly schema:
    "creatoros.factory.configuration";
  readonly schemaVersion: "1.0.0";
  readonly environment:
    FactoryEnvironment;
  readonly paths:
    FactoryPathConfiguration;
  readonly runtime:
    FactoryRuntimeConfiguration;
  readonly limits:
    FactoryExecutionLimitConfiguration;
  readonly retry:
    FactoryRetryConfiguration;
  readonly validation:
    FactoryValidationConfiguration;
  readonly git:
    FactoryGitConfiguration;
  readonly release:
    FactoryReleaseConfiguration;
  readonly metadata:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
}

export interface FactoryConfigurationOverride {
  readonly environment?:
    FactoryEnvironment;
  readonly paths?:
    Partial<
      FactoryPathConfiguration
    >;
  readonly runtime?:
    Partial<
      FactoryRuntimeConfiguration
    >;
  readonly limits?:
    Partial<
      FactoryExecutionLimitConfiguration
    >;
  readonly retry?:
    Partial<
      FactoryRetryConfiguration
    >;
  readonly validation?:
    Partial<
      FactoryValidationConfiguration
    >;
  readonly git?:
    Partial<
      FactoryGitConfiguration
    >;
  readonly release?:
    Partial<
      FactoryReleaseConfiguration
    >;
  readonly metadata?:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
}

export interface FactoryConfigurationValidationIssue {
  readonly code:
    | "INVALID_PATH"
    | "INVALID_LIMIT"
    | "INVALID_RETRY"
    | "INVALID_TIMEOUT"
    | "UNSAFE_PRODUCTION_SETTING"
    | "INVALID_GIT_SETTING";
  readonly path: string;
  readonly message: string;
}

export interface FactoryConfigurationValidationResult {
  readonly valid: boolean;
  readonly issues:
    readonly FactoryConfigurationValidationIssue[];
}
