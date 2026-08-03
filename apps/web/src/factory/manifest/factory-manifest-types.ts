import type {
  FactoryPackId,
  FactoryPackType,
  FactoryValidationGateType,
} from "../domain";

export type FactoryManifestVersion =
  `${number}.${number}.${number}`;

export type FactoryManifestDependencyType =
  | "factory-pack"
  | "workspace"
  | "package"
  | "service"
  | "file"
  | "capability";

export type FactoryManifestDependencyRequirement =
  | "required"
  | "optional"
  | "development";

export type FactoryManifestOutputType =
  | "file"
  | "directory"
  | "export"
  | "route"
  | "provider"
  | "module"
  | "test"
  | "manifest"
  | "release";

export type FactoryManifestInputType =
  | "string"
  | "number"
  | "boolean"
  | "enum"
  | "path"
  | "json"
  | "secret";

export interface FactoryManifestDependency {
  readonly id: string;
  readonly type:
    FactoryManifestDependencyType;
  readonly requirement:
    FactoryManifestDependencyRequirement;
  readonly version:
    string | null;
  readonly source:
    string | null;
  readonly description: string;
}

export interface FactoryManifestOutput {
  readonly id: string;
  readonly type:
    FactoryManifestOutputType;
  readonly path:
    string | null;
  readonly description: string;
  readonly required: boolean;
  readonly generated: boolean;
}

export interface FactoryManifestInputOption {
  readonly label: string;
  readonly value:
    string | number | boolean;
}

export interface FactoryManifestInput {
  readonly id: string;
  readonly type:
    FactoryManifestInputType;
  readonly label: string;
  readonly description: string;
  readonly required: boolean;
  readonly defaultValue:
    unknown;
  readonly options:
    readonly FactoryManifestInputOption[];
}

export interface FactoryManifestValidationGate {
  readonly id: string;
  readonly type:
    FactoryValidationGateType;
  readonly name: string;
  readonly required: boolean;
  readonly command:
    string | null;
}

export interface FactoryManifestMetadata {
  readonly author:
    string | null;
  readonly team:
    string | null;
  readonly repository:
    string | null;
  readonly branch:
    string | null;
  readonly tags:
    readonly string[];
  readonly labels:
    Readonly<
      Record<
        string,
        string
      >
    >;
}

export interface FactoryPackManifest {
  readonly schema:
    "creatoros.factory.pack-manifest";
  readonly schemaVersion:
    FactoryManifestVersion;
  readonly packId:
    FactoryPackId;
  readonly name: string;
  readonly description: string;
  readonly packType:
    FactoryPackType;
  readonly manifestVersion:
    FactoryManifestVersion;
  readonly capabilities:
    readonly string[];
  readonly dependencies:
    readonly FactoryManifestDependency[];
  readonly inputs:
    readonly FactoryManifestInput[];
  readonly outputs:
    readonly FactoryManifestOutput[];
  readonly validationGates:
    readonly FactoryManifestValidationGate[];
  readonly metadata:
    FactoryManifestMetadata;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateFactoryPackManifestInput {
  readonly packId: string;
  readonly name: string;
  readonly description?: string;
  readonly packType:
    FactoryPackType;
  readonly manifestVersion?:
    FactoryManifestVersion;
  readonly schemaVersion?:
    FactoryManifestVersion;
  readonly capabilities?:
    readonly string[];
  readonly dependencies?:
    readonly FactoryManifestDependency[];
  readonly inputs?:
    readonly FactoryManifestInput[];
  readonly outputs?:
    readonly FactoryManifestOutput[];
  readonly validationGates?:
    readonly FactoryManifestValidationGate[];
  readonly metadata?:
    Partial<
      FactoryManifestMetadata
    >;
  readonly createdAt?: string;
}

export interface FactoryManifestValidationIssue {
  readonly code:
    | "INVALID_MANIFEST"
    | "DUPLICATE_ID"
    | "MISSING_REQUIRED_GATE"
    | "INVALID_DEPENDENCY"
    | "INVALID_OUTPUT"
    | "INVALID_INPUT";
  readonly path: string;
  readonly message: string;
}

export interface FactoryManifestValidationResult {
  readonly valid: boolean;
  readonly issues:
    readonly FactoryManifestValidationIssue[];
}
