import type {
  ProjectDependencyEdge,
  ProjectDependencyNode,
} from "./project-deep-intelligence-interfaces";

import {
  DependencyGraphEngine,
} from "./dependency-graph-engine";

export interface ExportReference {

  readonly exporter:
    ProjectDependencyNode;

  readonly consumer:
    ProjectDependencyNode;

  readonly edge:
    ProjectDependencyEdge;

}

export interface ExportAnalysis {

  readonly totalExports:
    number;

  readonly reExports:
    number;

  readonly internalConsumers:
    number;

  readonly externalConsumers:
    number;

  readonly exports:
    readonly ExportReference[];

}

export class ExportAnalysisEngine {

  constructor(
    private readonly graph:
      DependencyGraphEngine,
  ) {}

  analyze():
    ExportAnalysis {

    const dependencyGraph =
      this.graph.build();

    const exports:
      ExportReference[] =
      [];

    let reExports =
      0;

    let internalConsumers =
      0;

    let externalConsumers =
      0;

    for (
      const edge of
      dependencyGraph.edges
    ) {

      const exporter =
        dependencyGraph.nodes.find(
          node =>
            node.id ===
            edge.target,
        );

      const consumer =
        dependencyGraph.nodes.find(
          node =>
            node.id ===
            edge.source,
        );

      if (
        !exporter ||
        !consumer
      ) {
        continue;
      }

      exports.push({
        exporter,
        consumer,
        edge,
      });

      if (
        edge.kind ===
        "re-export"
      ) {

        reExports++;

      }

      if (
        edge.kind ===
        "external-package"
      ) {

        externalConsumers++;

      }
      else {

        internalConsumers++;

      }

    }

    return {

      totalExports:
        exports.length,

      reExports,

      internalConsumers,

      externalConsumers,

      exports,

    };

  }

  reExports() {

    return this
      .analyze()
      .exports
      .filter(
        item =>
          item.edge.kind ===
          "re-export",
      );

  }

  exportedModules() {

    return this
      .analyze()
      .exports
      .map(
        item =>
          item.exporter,
      );

  }

  consumersOf(
    moduleId: string,
  ) {

    return this
      .analyze()
      .exports
      .filter(
        item =>
          item.exporter.id ===
          moduleId,
      );

  }

}
