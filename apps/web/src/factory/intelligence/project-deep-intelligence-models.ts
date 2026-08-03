import type {
  CircularDependency,
  DeepProjectIntelligence,
  Hotspot,
  LayerDefinition,
  LayerViolation,
  ModuleHealth,
  ProjectDependencyEdge,
  ProjectDependencyGraph,
  ProjectDependencyNode,
  RefactoringSuggestion,
  TechnicalDebtItem,
} from "./project-deep-intelligence-interfaces";

import {
  HealthGrade,
  RefactoringPriority,
} from "./project-deep-intelligence-types";

export class DependencyNodeModel
  implements ProjectDependencyNode
{
  constructor(
    readonly id: string,
    readonly path: string,
    readonly workspace: string,
    readonly moduleName: string,
    readonly directory: string,
    readonly fileName: string,
    readonly extension: string,
    readonly language: string,
    readonly category:
      ProjectDependencyNode["category"],
  ) {}
}

export class DependencyEdgeModel
  implements ProjectDependencyEdge
{
  constructor(
    readonly source: string,
    readonly target: string,
    readonly kind:
      ProjectDependencyEdge["kind"],
    readonly optional: boolean,
  ) {}
}

export class DependencyGraphModel
  implements ProjectDependencyGraph
{
  readonly schema =
    "creatoros.factory.dependency-graph" as const;

  readonly version =
    "1.0.0" as const;

  constructor(
    readonly nodes:
      readonly ProjectDependencyNode[],
    readonly edges:
      readonly ProjectDependencyEdge[],
  ) {}
}

export class CircularDependencyModel
  implements CircularDependency
{
  constructor(
    readonly id: string,
    readonly nodes:
      readonly string[],
    readonly edges:
      readonly ProjectDependencyEdge[],
  ) {}
}

export class LayerDefinitionModel
  implements LayerDefinition
{
  constructor(
    readonly name: string,
    readonly order: number,
    readonly pathPatterns:
      readonly string[],
  ) {}
}

export class LayerViolationModel
  implements LayerViolation
{
  constructor(
    readonly sourceLayer: string,
    readonly targetLayer: string,
    readonly source: string,
    readonly target: string,
    readonly reason: string,
  ) {}
}

export class ModuleHealthModel
  implements ModuleHealth
{
  readonly grade: HealthGrade;

  constructor(
    readonly moduleId: string,
    readonly score: number,
    readonly imports: number,
    readonly exports: number,
    readonly fanIn: number,
    readonly fanOut: number,
  ) {
    if (score >= 90) {
      this.grade =
        HealthGrade.Excellent;
    } else if (score >= 75) {
      this.grade =
        HealthGrade.Good;
    } else if (score >= 60) {
      this.grade =
        HealthGrade.Fair;
    } else if (score >= 40) {
      this.grade =
        HealthGrade.Poor;
    } else {
      this.grade =
        HealthGrade.Critical;
    }
  }
}

export class TechnicalDebtModel
  implements TechnicalDebtItem
{
  constructor(
    readonly id: string,
    readonly path: string,
    readonly severity:
      TechnicalDebtItem["severity"],
    readonly category:
      TechnicalDebtItem["category"],
    readonly message: string,
  ) {}
}

export class HotspotModel
  implements Hotspot
{
  constructor(
    readonly path: string,
    readonly score: number,
    readonly imports: number,
    readonly dependents: number,
  ) {}
}

export class RefactoringSuggestionModel
  implements RefactoringSuggestion
{
  readonly priority:
    RefactoringPriority;

  constructor(
    readonly id: string,
    readonly title: string,
    readonly description: string,
    readonly affectedFiles:
      readonly string[],
    priority:
      RefactoringPriority =
        RefactoringPriority.Medium,
  ) {
    this.priority =
      priority;
  }
}

export class DeepProjectIntelligenceModel
  implements DeepProjectIntelligence
{
  constructor(
    readonly graph:
      ProjectDependencyGraph,
    readonly cycles:
      readonly CircularDependency[],
    readonly layers:
      readonly LayerDefinition[],
    readonly violations:
      readonly LayerViolation[],
    readonly health:
      readonly ModuleHealth[],
    readonly debt:
      readonly TechnicalDebtItem[],
    readonly hotspots:
      readonly Hotspot[],
    readonly suggestions:
      readonly RefactoringSuggestion[],
  ) {}
}
