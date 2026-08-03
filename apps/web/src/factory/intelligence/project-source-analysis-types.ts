import type {
  ProjectInventory,
  ProjectInventoryNode,
} from "./project-intelligence-types";

export type ProjectSourceSymbolKind =
  | "default"
  | "named"
  | "namespace"
  | "type"
  | "side-effect"
  | "unknown";

export type ProjectExportKind =
  | "default"
  | "named"
  | "type"
  | "re-export"
  | "wildcard"
  | "unknown";

export interface ProjectImportSymbol {
  readonly imported: string;
  readonly local: string;
  readonly kind:
    ProjectSourceSymbolKind;
}

export interface ProjectSourceImport {
  readonly source: string;
  readonly resolvedPath:
    string | null;
  readonly external: boolean;
  readonly dynamic: boolean;
  readonly typeOnly: boolean;
  readonly symbols:
    readonly ProjectImportSymbol[];
}

export interface ProjectSourceExport {
  readonly name: string;
  readonly kind:
    ProjectExportKind;
  readonly source:
    string | null;
  readonly typeOnly: boolean;
}

export interface ProjectSourceFileAnalysis {
  readonly path: string;
  readonly imports:
    readonly ProjectSourceImport[];
  readonly exports:
    readonly ProjectSourceExport[];
  readonly declaredSymbols:
    readonly string[];
  readonly hasDefaultExport: boolean;
  readonly isIndexModule: boolean;
  readonly parseWarnings:
    readonly string[];
}

export interface ProjectSourceAnalysis {
  readonly schema:
    "creatoros.factory.project-source-analysis";
  readonly version:
    "1.0.0";
  readonly files:
    readonly ProjectSourceFileAnalysis[];
  readonly analyzedAt: string;
}

export type ProjectDependencyKind =
  | "internal-import"
  | "external-package"
  | "re-export"
  | "dynamic-import";

export interface ProjectDependencyEdge {
  readonly id: string;
  readonly sourcePath: string;
  readonly target:
    string;
  readonly resolvedPath:
    string | null;
  readonly kind:
    ProjectDependencyKind;
  readonly typeOnly: boolean;
}

export interface ProjectDependencyNode {
  readonly path: string;
  readonly incoming: number;
  readonly outgoing: number;
  readonly externalDependencies:
    readonly string[];
}

export interface ProjectDependencyCycle {
  readonly id: string;
  readonly paths:
    readonly string[];
}

export interface ProjectDependencyGraph {
  readonly schema:
    "creatoros.factory.project-dependency-graph";
  readonly version:
    "1.0.0";
  readonly nodes:
    readonly ProjectDependencyNode[];
  readonly edges:
    readonly ProjectDependencyEdge[];
  readonly cycles:
    readonly ProjectDependencyCycle[];
  readonly generatedAt: string;
}

export interface ProjectPackageReference {
  readonly name: string;
  readonly files:
    readonly string[];
  readonly importCount: number;
  readonly typeOnlyCount: number;
  readonly dynamicCount: number;
}

export interface ProjectModuleDiscovery {
  readonly indexModules:
    readonly string[];
  readonly testModules:
    readonly string[];
  readonly sourceModules:
    readonly string[];
  readonly styleModules:
    readonly string[];
  readonly configurationModules:
    readonly string[];
  readonly packages:
    readonly ProjectPackageReference[];
}

export interface ProjectIntelligenceReport {
  readonly inventory:
    ProjectInventory;
  readonly analysis:
    ProjectSourceAnalysis;
  readonly dependencyGraph:
    ProjectDependencyGraph;
  readonly discovery:
    ProjectModuleDiscovery;
  readonly summary: {
    readonly files: number;
    readonly analyzedFiles: number;
    readonly imports: number;
    readonly exports: number;
    readonly internalDependencies: number;
    readonly externalDependencies: number;
    readonly circularDependencies: number;
    readonly indexModules: number;
    readonly packages: number;
  };
}

export interface AnalyzeProjectSourceOptions {
  readonly now?:
    () => string;
  readonly resolveExtensions?:
    readonly string[];
}

export interface BuildProjectDependencyGraphOptions {
  readonly now?:
    () => string;
}

export interface CreateProjectIntelligenceReportInput {
  readonly inventory:
    ProjectInventory;
  readonly contents:
    Readonly<
      Record<
        string,
        string
      >
    >;
  readonly now?:
    () => string;
}

export function isSourceInventoryNode(
  node:
    ProjectInventoryNode,
): boolean {
  return (
    node.type === "file" &&
    (
      node.language === "typescript" ||
      node.language === "tsx" ||
      node.language === "javascript" ||
      node.language === "jsx"
    )
  );
}
