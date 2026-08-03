export interface ProjectDependencyNode {
  readonly id: string;
  readonly path: string;
  readonly workspace: string;
  readonly moduleName: string;
  readonly directory: string;
  readonly fileName: string;
  readonly extension: string;
  readonly language: string;
  readonly category:
    | "application"
    | "feature"
    | "domain"
    | "service"
    | "shared"
    | "library"
    | "configuration"
    | "test"
    | "unknown";
}

export interface ProjectDependencyEdge {
  readonly source: string;
  readonly target: string;
  readonly kind:
    | "import"
    | "dynamic-import"
    | "re-export"
    | "external-package";
  readonly optional: boolean;
}

export interface ProjectDependencyGraph {
  readonly schema:
    "creatoros.factory.dependency-graph";
  readonly version:
    "1.0.0";
  readonly nodes:
    readonly ProjectDependencyNode[];
  readonly edges:
    readonly ProjectDependencyEdge[];
}

export interface CircularDependency {
  readonly id: string;
  readonly nodes:
    readonly string[];
  readonly edges:
    readonly ProjectDependencyEdge[];
}

export interface LayerDefinition {
  readonly name: string;
  readonly order: number;
  readonly pathPatterns:
    readonly string[];
}

export interface LayerViolation {
  readonly sourceLayer: string;
  readonly targetLayer: string;
  readonly source: string;
  readonly target: string;
  readonly reason: string;
}

export interface ModuleHealth {
  readonly moduleId: string;
  readonly score: number;
  readonly imports: number;
  readonly exports: number;
  readonly fanIn: number;
  readonly fanOut: number;
}

export interface TechnicalDebtItem {
  readonly id: string;
  readonly path: string;
  readonly severity:
    | "low"
    | "medium"
    | "high"
    | "critical";
  readonly category:
    | "todo"
    | "fixme"
    | "deprecated"
    | "duplicate"
    | "complexity"
    | "dead-code";
  readonly message: string;
}

export interface Hotspot {
  readonly path: string;
  readonly score: number;
  readonly imports: number;
  readonly dependents: number;
}

export interface RefactoringSuggestion {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly affectedFiles:
    readonly string[];
}

export interface DeepProjectIntelligence {
  readonly graph:
    ProjectDependencyGraph;
  readonly cycles:
    readonly CircularDependency[];
  readonly layers:
    readonly LayerDefinition[];
  readonly violations:
    readonly LayerViolation[];
  readonly health:
    readonly ModuleHealth[];
  readonly debt:
    readonly TechnicalDebtItem[];
  readonly hotspots:
    readonly Hotspot[];
  readonly suggestions:
    readonly RefactoringSuggestion[];
}
