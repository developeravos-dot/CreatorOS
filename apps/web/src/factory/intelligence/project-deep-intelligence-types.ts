export type DependencyKind =
  | "import"
  | "dynamic-import"
  | "re-export"
  | "external-package";

export type ModuleCategory =
  | "application"
  | "feature"
  | "domain"
  | "service"
  | "shared"
  | "library"
  | "configuration"
  | "test"
  | "unknown";

export type LayerName =
  | "presentation"
  | "application"
  | "domain"
  | "infrastructure"
  | "shared";

export type Severity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type DebtCategory =
  | "todo"
  | "fixme"
  | "deprecated"
  | "duplicate"
  | "complexity"
  | "dead-code";

export enum DependencyDirection {
  Incoming = "incoming",
  Outgoing = "outgoing",
  Bidirectional = "bidirectional",
}

export enum GraphTraversal {
  DFS = "dfs",
  BFS = "bfs",
}

export enum HealthGrade {
  Excellent = "excellent",
  Good = "good",
  Fair = "fair",
  Poor = "poor",
  Critical = "critical",
}

export enum RefactoringPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
  Critical = "critical",
}

export interface DependencyStatistics {
  readonly totalNodes: number;
  readonly totalEdges: number;
  readonly internalDependencies: number;
  readonly externalDependencies: number;
  readonly circularDependencies: number;
}

export interface GraphTraversalResult {
  readonly visited: readonly string[];
  readonly depth: number;
}

export interface DependencyLookup {
  readonly nodeId: string;
  readonly incoming: readonly string[];
  readonly outgoing: readonly string[];
}

export interface ProjectHealthScore {
  readonly score: number;
  readonly grade: HealthGrade;
}

export interface TechnicalDebtSummary {
  readonly total: number;
  readonly low: number;
  readonly medium: number;
  readonly high: number;
  readonly critical: number;
}
