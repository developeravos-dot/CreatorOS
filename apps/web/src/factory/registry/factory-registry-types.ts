export type FactoryRegistryEntryId =
  string & {
    readonly __factoryRegistryEntryId:
      unique symbol;
  };

export type FactoryRegistryType =
  | "generator"
  | "validator"
  | "template"
  | "runtime";

export type FactoryRegistryEntryStatus =
  | "active"
  | "disabled"
  | "deprecated";

export type FactoryRegistryCapability =
  | "domain"
  | "types"
  | "engine"
  | "storage"
  | "runtime"
  | "api"
  | "ui"
  | "tests"
  | "integration"
  | "validation"
  | "repair"
  | "release"
  | "custom";

export interface FactoryRegistryDependency {
  readonly id:
    FactoryRegistryEntryId;
  readonly required: boolean;
  readonly minimumVersion:
    string | null;
}

export interface FactoryRegistryEntry {
  readonly id:
    FactoryRegistryEntryId;
  readonly registryType:
    FactoryRegistryType;
  readonly name: string;
  readonly description: string;
  readonly version: string;
  readonly status:
    FactoryRegistryEntryStatus;
  readonly capabilities:
    readonly FactoryRegistryCapability[];
  readonly dependencies:
    readonly FactoryRegistryDependency[];
  readonly priority: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly metadata:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
}

export interface CreateFactoryRegistryEntryInput {
  readonly id: string;
  readonly registryType:
    FactoryRegistryType;
  readonly name: string;
  readonly description?: string;
  readonly version?: string;
  readonly status?:
    FactoryRegistryEntryStatus;
  readonly capabilities?:
    readonly FactoryRegistryCapability[];
  readonly dependencies?:
    readonly FactoryRegistryDependency[];
  readonly priority?: number;
  readonly metadata?:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
  readonly createdAt?: string;
}

export interface FactoryRegistry {
  readonly entries:
    readonly FactoryRegistryEntry[];
  readonly version: number;
  readonly updatedAt: string;
}

export interface FactoryRegistryQuery {
  readonly registryType?:
    FactoryRegistryType;
  readonly status?:
    FactoryRegistryEntryStatus;
  readonly capability?:
    FactoryRegistryCapability;
  readonly search?: string;
}

export interface FactoryRegistryDependencyIssue {
  readonly entryId:
    FactoryRegistryEntryId;
  readonly dependencyId:
    FactoryRegistryEntryId;
  readonly code:
    | "MISSING_DEPENDENCY"
    | "DISABLED_DEPENDENCY"
    | "VERSION_MISMATCH";
  readonly message: string;
}

export interface FactoryRegistryValidationResult {
  readonly valid: boolean;
  readonly issues:
    readonly FactoryRegistryDependencyIssue[];
}

export interface FactoryRegistrySummary {
  readonly total: number;
  readonly active: number;
  readonly disabled: number;
  readonly deprecated: number;
  readonly generators: number;
  readonly validators: number;
  readonly templates: number;
  readonly runtimes: number;
}
