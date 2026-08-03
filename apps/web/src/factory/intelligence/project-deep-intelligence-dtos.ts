import type {
  CircularDependency,
  DeepProjectIntelligence,
  Hotspot,
  LayerDefinition,
  LayerViolation,
  ModuleHealth,
  ProjectDependencyGraph,
  RefactoringSuggestion,
  TechnicalDebtItem,
} from "./project-deep-intelligence-interfaces";

export interface DependencyGraphDto {
  schema: string;
  version: string;
  nodes: number;
  edges: number;
}

export interface CircularDependencyDto {
  id: string;
  size: number;
  nodes: string[];
}

export interface LayerViolationDto {
  sourceLayer: string;
  targetLayer: string;
  reason: string;
}

export interface ModuleHealthDto {
  moduleId: string;
  score: number;
  imports: number;
  exports: number;
  fanIn: number;
  fanOut: number;
}

export interface TechnicalDebtDto {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface HotspotDto {
  path: string;
  score: number;
}

export interface RefactoringSuggestionDto {
  id: string;
  title: string;
  files: number;
}

export interface DeepProjectIntelligenceDto {
  graph: DependencyGraphDto;
  cycles: CircularDependencyDto[];
  violations: LayerViolationDto[];
  health: ModuleHealthDto[];
  debt: TechnicalDebtDto;
  hotspots: HotspotDto[];
  suggestions: RefactoringSuggestionDto[];
}

export class DeepProjectIntelligenceMapper {
  static graph(
    graph: ProjectDependencyGraph,
  ): DependencyGraphDto {
    return {
      schema: graph.schema,
      version: graph.version,
      nodes: graph.nodes.length,
      edges: graph.edges.length,
    };
  }

  static cycles(
    cycles: readonly CircularDependency[],
  ): CircularDependencyDto[] {
    return cycles.map(
      cycle => ({
        id: cycle.id,
        size: cycle.nodes.length,
        nodes: [...cycle.nodes],
      }),
    );
  }

  static violations(
    violations:
      readonly LayerViolation[],
  ): LayerViolationDto[] {
    return violations.map(
      violation => ({
        sourceLayer:
          violation.sourceLayer,
        targetLayer:
          violation.targetLayer,
        reason:
          violation.reason,
      }),
    );
  }

  static health(
    modules:
      readonly ModuleHealth[],
  ): ModuleHealthDto[] {
    return modules.map(
      module => ({
        moduleId:
          module.moduleId,
        score:
          module.score,
        imports:
          module.imports,
        exports:
          module.exports,
        fanIn:
          module.fanIn,
        fanOut:
          module.fanOut,
      }),
    );
  }

  static debt(
    debt:
      readonly TechnicalDebtItem[],
  ): TechnicalDebtDto {
    return {
      total:
        debt.length,
      critical:
        debt.filter(
          item =>
            item.severity ===
            "critical",
        ).length,
      high:
        debt.filter(
          item =>
            item.severity ===
            "high",
        ).length,
      medium:
        debt.filter(
          item =>
            item.severity ===
            "medium",
        ).length,
      low:
        debt.filter(
          item =>
            item.severity ===
            "low",
        ).length,
    };
  }

  static hotspots(
    hotspots:
      readonly Hotspot[],
  ): HotspotDto[] {
    return hotspots.map(
      hotspot => ({
        path:
          hotspot.path,
        score:
          hotspot.score,
      }),
    );
  }

  static suggestions(
    suggestions:
      readonly RefactoringSuggestion[],
  ): RefactoringSuggestionDto[] {
    return suggestions.map(
      suggestion => ({
        id:
          suggestion.id,
        title:
          suggestion.title,
        files:
          suggestion.affectedFiles
            .length,
      }),
    );
  }

  static intelligence(
    intelligence:
      DeepProjectIntelligence,
  ): DeepProjectIntelligenceDto {
    return {
      graph:
        this.graph(
          intelligence.graph,
        ),
      cycles:
        this.cycles(
          intelligence.cycles,
        ),
      violations:
        this.violations(
          intelligence.violations,
        ),
      health:
        this.health(
          intelligence.health,
        ),
      debt:
        this.debt(
          intelligence.debt,
        ),
      hotspots:
        this.hotspots(
          intelligence.hotspots,
        ),
      suggestions:
        this.suggestions(
          intelligence.suggestions,
        ),
    };
  }
}
