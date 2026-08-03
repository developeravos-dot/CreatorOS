import type {
  FactoryPackId,
} from "../domain";

export type FactoryBlueprintId =
  string & {
    readonly __factoryBlueprintId:
      unique symbol;
  };

export type FactoryBlueprintNodeId =
  string & {
    readonly __factoryBlueprintNodeId:
      unique symbol;
  };

export type FactoryBlueprintNodeType =
  | "root"
  | "directory"
  | "file"
  | "export"
  | "route"
  | "provider"
  | "module"
  | "validation"
  | "release";

export type FactoryBlueprintFileOperation =
  | "create"
  | "update"
  | "delete"
  | "move"
  | "rename"
  | "preserve";

export type FactoryBlueprintFileKind =
  | "typescript"
  | "tsx"
  | "javascript"
  | "json"
  | "css"
  | "markdown"
  | "yaml"
  | "text"
  | "unknown";

export type FactoryBlueprintDependencyType =
  | "requires"
  | "imports"
  | "exports"
  | "registers"
  | "validates"
  | "generates"
  | "replaces";

export type FactoryBlueprintStatus =
  | "draft"
  | "validated"
  | "planned"
  | "applied"
  | "failed";

export interface FactoryBlueprintLocation {
  readonly path: string;
  readonly parentPath:
    string | null;
  readonly absolute: boolean;
}

export interface FactoryBlueprintFileSpecification {
  readonly operation:
    FactoryBlueprintFileOperation;
  readonly kind:
    FactoryBlueprintFileKind;
  readonly location:
    FactoryBlueprintLocation;
  readonly templateId:
    string | null;
  readonly encoding:
    "utf8-no-bom";
  readonly overwrite: boolean;
  readonly required: boolean;
  readonly expectedExports:
    readonly string[];
}

export interface FactoryBlueprintDependency {
  readonly id: string;
  readonly sourceNodeId:
    FactoryBlueprintNodeId;
  readonly targetNodeId:
    FactoryBlueprintNodeId;
  readonly type:
    FactoryBlueprintDependencyType;
  readonly required: boolean;
  readonly description: string;
}

export interface FactoryBlueprintNode {
  readonly id:
    FactoryBlueprintNodeId;
  readonly blueprintId:
    FactoryBlueprintId;
  readonly type:
    FactoryBlueprintNodeType;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly parentId:
    FactoryBlueprintNodeId | null;
  readonly children:
    readonly FactoryBlueprintNodeId[];
  readonly file:
    FactoryBlueprintFileSpecification | null;
  readonly metadata:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
}

export interface FactoryBlueprint {
  readonly id:
    FactoryBlueprintId;
  readonly packId:
    FactoryPackId;
  readonly name: string;
  readonly description: string;
  readonly status:
    FactoryBlueprintStatus;
  readonly version: number;
  readonly rootNodeId:
    FactoryBlueprintNodeId;
  readonly nodes:
    readonly FactoryBlueprintNode[];
  readonly dependencies:
    readonly FactoryBlueprintDependency[];
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

export interface CreateFactoryBlueprintInput {
  readonly id: string;
  readonly packId:
    FactoryPackId;
  readonly name: string;
  readonly description?: string;
  readonly rootName?: string;
  readonly createdAt?: string;
  readonly metadata?:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
}

export interface CreateFactoryBlueprintNodeInput {
  readonly id: string;
  readonly type:
    Exclude<
      FactoryBlueprintNodeType,
      "root"
    >;
  readonly name: string;
  readonly description?: string;
  readonly order: number;
  readonly parentId?:
    FactoryBlueprintNodeId;
  readonly file?:
    FactoryBlueprintFileSpecification;
  readonly metadata?:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
}

export interface CreateFactoryBlueprintDependencyInput {
  readonly id: string;
  readonly sourceNodeId:
    FactoryBlueprintNodeId;
  readonly targetNodeId:
    FactoryBlueprintNodeId;
  readonly type:
    FactoryBlueprintDependencyType;
  readonly required?: boolean;
  readonly description?: string;
}

export interface FactoryBlueprintValidationIssue {
  readonly code:
    | "ROOT_NOT_FOUND"
    | "DUPLICATE_NODE"
    | "PARENT_NOT_FOUND"
    | "CHILD_NOT_FOUND"
    | "DEPENDENCY_SOURCE_NOT_FOUND"
    | "DEPENDENCY_TARGET_NOT_FOUND"
    | "CIRCULAR_PARENT"
    | "INVALID_FILE_NODE"
    | "DUPLICATE_PATH";
  readonly path: string;
  readonly message: string;
}

export interface FactoryBlueprintValidationResult {
  readonly valid: boolean;
  readonly issues:
    readonly FactoryBlueprintValidationIssue[];
}

export interface FactoryBlueprintSummary {
  readonly nodes: number;
  readonly directories: number;
  readonly files: number;
  readonly createOperations: number;
  readonly updateOperations: number;
  readonly deleteOperations: number;
  readonly dependencies: number;
}
