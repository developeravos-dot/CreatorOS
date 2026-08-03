import type {
  ProjectDependencyNode,
} from "./project-deep-intelligence-interfaces";

import {
  DependencyGraphEngine,
} from "./dependency-graph-engine";

export type ArchitectureLayer =
  | "presentation"
  | "application"
  | "domain"
  | "infrastructure"
  | "shared"
  | "unknown";

export interface LayerNode {

  readonly node:
    ProjectDependencyNode;

  readonly layer:
    ArchitectureLayer;

}

export interface LayerViolation {

  readonly source:
    string;

  readonly target:
    string;

  readonly sourceLayer:
    ArchitectureLayer;

  readonly targetLayer:
    ArchitectureLayer;

}

export interface LayerDetectionReport {

  readonly nodes:
    readonly LayerNode[];

  readonly violations:
    readonly LayerViolation[];

}

export class LayerDetectionEngine {

  constructor(
    private readonly graph:
      DependencyGraphEngine,
  ) {}

  analyze():
    LayerDetectionReport {

    const dependencyGraph =
      this.graph.build();

    const nodeMap =
      new Map(
        dependencyGraph.nodes.map(
          node => [
            node.id,
            node,
          ],
        ),
      );

    const nodes =
      dependencyGraph.nodes.map(
        node => ({

          node,

          layer:
            this.detectLayer(
              node.path,
            ),

        }),
      );

    const layerLookup =
      new Map(
        nodes.map(
          item => [
            item.node.id,
            item.layer,
          ],
        ),
      );

    const violations:
      LayerViolation[] =
      [];

    for (
      const edge of
      dependencyGraph.edges
    ) {

      if (
        edge.kind ===
        "external-package"
      ) {
        continue;
      }

      const source =
        nodeMap.get(
          edge.source,
        );

      const target =
        nodeMap.get(
          edge.target,
        );

      if (
        !source ||
        !target
      ) {
        continue;
      }

      const sourceLayer =
        layerLookup.get(
          source.id,
        )!;

      const targetLayer =
        layerLookup.get(
          target.id,
        )!;

      if (
        this.isViolation(
          sourceLayer,
          targetLayer,
        )
      ) {

        violations.push({

          source:
            source.path,

          target:
            target.path,

          sourceLayer,

          targetLayer,

        });

      }

    }

    return {

      nodes,

      violations,

    };

  }

  private detectLayer(
    path: string,
  ): ArchitectureLayer {

    const normalized =
      path.toLowerCase();

    if (
      normalized.includes(
        "/ui/",
      ) ||
      normalized.includes(
        "/components/",
      ) ||
      normalized.includes(
        "/pages/",
      )
    ) {
      return "presentation";
    }

    if (
      normalized.includes(
        "/application/",
      ) ||
      normalized.includes(
        "/services/",
      )
    ) {
      return "application";
    }

    if (
      normalized.includes(
        "/domain/",
      ) ||
      normalized.includes(
        "/entities/",
      )
    ) {
      return "domain";
    }

    if (
      normalized.includes(
        "/infrastructure/",
      ) ||
      normalized.includes(
        "/adapters/",
      )
    ) {
      return "infrastructure";
    }

    if (
      normalized.includes(
        "/shared/",
      ) ||
      normalized.includes(
        "/common/",
      )
    ) {
      return "shared";
    }

    return "unknown";

  }

  private isViolation(
    source:
      ArchitectureLayer,
    target:
      ArchitectureLayer,
  ): boolean {

    if (
      source ===
      "domain"
    ) {

      return (
        target ===
          "presentation" ||
        target ===
          "application"
      );

    }

    return false;

  }

}
