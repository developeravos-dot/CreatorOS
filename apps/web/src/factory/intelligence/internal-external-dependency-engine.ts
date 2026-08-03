import type {
  ProjectDependencyEdge,
  ProjectDependencyNode,
} from "./project-deep-intelligence-interfaces";

import {
  DependencyGraphEngine,
} from "./dependency-graph-engine";

export interface InternalDependency {

  readonly source:
    ProjectDependencyNode;

  readonly target:
    ProjectDependencyNode;

  readonly edge:
    ProjectDependencyEdge;

}

export interface ExternalDependency {

  readonly source:
    ProjectDependencyNode;

  readonly packageName:
    string;

  readonly edge:
    ProjectDependencyEdge;

}

export interface DependencySummary {

  readonly internal:
    readonly InternalDependency[];

  readonly external:
    readonly ExternalDependency[];

  readonly internalCount:
    number;

  readonly externalCount:
    number;

}

export class InternalExternalDependencyEngine {

  constructor(
    private readonly graph:
      DependencyGraphEngine,
  ) {}

  analyze():
    DependencySummary {

    const dependencyGraph =
      this.graph.build();

    const internal:
      InternalDependency[] =
      [];

    const external:
      ExternalDependency[] =
      [];

    const nodeMap =
      new Map(
        dependencyGraph.nodes.map(
          node => [
            node.id,
            node,
          ],
        ),
      );

    for (
      const edge of
      dependencyGraph.edges
    ) {

      const source =
        nodeMap.get(
          edge.source,
        );

      if (
        !source
      ) {
        continue;
      }

      if (
        edge.kind ===
        "external-package"
      ) {

        external.push({

          source,

          packageName:
            edge.target,

          edge,

        });

        continue;

      }

      const target =
        nodeMap.get(
          edge.target,
        );

      if (
        !target
      ) {
        continue;
      }

      internal.push({

        source,

        target,

        edge,

      });

    }

    return {

      internal,

      external,

      internalCount:
        internal.length,

      externalCount:
        external.length,

    };

  }

  internalDependenciesOf(
    moduleId: string,
  ) {

    return this
      .analyze()
      .internal
      .filter(
        dependency =>
          dependency
            .source
            .id ===
          moduleId,
      );

  }

  externalDependenciesOf(
    moduleId: string,
  ) {

    return this
      .analyze()
      .external
      .filter(
        dependency =>
          dependency
            .source
            .id ===
          moduleId,
      );

  }

  internalDependencyCount(
    moduleId: string,
  ) {

    return this
      .internalDependenciesOf(
        moduleId,
      )
      .length;

  }

  externalDependencyCount(
    moduleId: string,
  ) {

    return this
      .externalDependenciesOf(
        moduleId,
      )
      .length;

  }

}
