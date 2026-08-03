export type ProjectInventoryNodeId =
  string & {
    readonly __projectInventoryNodeId:
      unique symbol;
  };

export type ProjectInventoryNodeType =
  | "file"
  | "directory";

export type ProjectSourceLanguage =
  | "typescript"
  | "tsx"
  | "javascript"
  | "jsx"
  | "json"
  | "css"
  | "scss"
  | "html"
  | "markdown"
  | "yaml"
  | "shell"
  | "powershell"
  | "unknown";

export type ProjectFileRole =
  | "source"
  | "test"
  | "style"
  | "configuration"
  | "manifest"
  | "documentation"
  | "generated"
  | "asset"
  | "unknown";

export interface ProjectSnapshotFile {
  readonly path: string;
  readonly content?: string | null;
  readonly sizeBytes?: number;
  readonly modifiedAt?: string | null;
  readonly generated?: boolean;
}

export interface ProjectSnapshot {
  readonly repositoryRoot: string;
  readonly files:
    readonly ProjectSnapshotFile[];
  readonly capturedAt?: string;
  readonly metadata?:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
}

export interface ProjectInventoryNode {
  readonly id:
    ProjectInventoryNodeId;
  readonly type:
    ProjectInventoryNodeType;
  readonly name: string;
  readonly path: string;
  readonly parentPath:
    string | null;
  readonly depth: number;
  readonly extension:
    string | null;
  readonly language:
    ProjectSourceLanguage;
  readonly role:
    ProjectFileRole;
  readonly sizeBytes: number;
  readonly modifiedAt:
    string | null;
  readonly generated: boolean;
  readonly hasContent: boolean;
}

export interface ProjectInventory {
  readonly schema:
    "creatoros.factory.project-inventory";
  readonly version:
    "1.0.0";
  readonly repositoryRoot: string;
  readonly nodes:
    readonly ProjectInventoryNode[];
  readonly capturedAt: string;
  readonly metadata:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
}

export interface ProjectInventorySummary {
  readonly nodes: number;
  readonly files: number;
  readonly directories: number;
  readonly sourceFiles: number;
  readonly testFiles: number;
  readonly configurationFiles: number;
  readonly generatedFiles: number;
  readonly totalBytes: number;
  readonly maximumDepth: number;
  readonly languages:
    Readonly<
      Partial<
        Record<
          ProjectSourceLanguage,
          number
        >
      >
    >;
}

export interface ProjectInventoryQuery {
  readonly search?: string;
  readonly type?:
    ProjectInventoryNodeType;
  readonly language?:
    ProjectSourceLanguage;
  readonly role?:
    ProjectFileRole;
  readonly generated?: boolean;
  readonly pathPrefix?: string;
}

export interface ProjectInventoryValidationIssue {
  readonly code:
    | "EMPTY_REPOSITORY_ROOT"
    | "DUPLICATE_PATH"
    | "INVALID_PATH"
    | "NEGATIVE_SIZE"
    | "PARENT_NOT_FOUND";
  readonly path: string;
  readonly message: string;
}

export interface ProjectInventoryValidationResult {
  readonly valid: boolean;
  readonly issues:
    readonly ProjectInventoryValidationIssue[];
}
