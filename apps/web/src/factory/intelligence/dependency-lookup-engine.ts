import type {
  ProjectDependencyEdge,
  ProjectDependencyNode,
} from "./project-deep-intelligence-interfaces";

import {
  GraphIndexEngine,
} from "./graph-index-engine";

import {
  DependencyGraphEngine,
} from "./dependency-graph-engine";

export interface DependencyLookupResult {

  readonly node:
    ProjectDependencyNode;

  readonly incoming:
    readonly ProjectDependencyEdge[];

  readonly outgoing:
    readonly ProjectDependencyEdge[];

  readonly dependencies:
    readonly ProjectDependencyNode[];

  readonly dependents:
    readonly ProjectDependencyNode[];

}

export class DependencyLookupEngine {

  private readonly index;

  constructor(
    graph:
      DependencyGraphEngine,
  ) {

    this.index =
      new GraphIndexEngine(
        graph,
      );

  }

  byId(
    id: string,
  ):
    DependencyLookupResult {

    const node =
      this.index.findNode(
        id,
      );

    if (
      !node
    ) {

      throw new Error(
        `Unknown dependency node: ${id}`,
      );

    }

    return this.build(
      node,
    );

  }

  byPath(
    path: string,
  ):
    DependencyLookupResult {

    const node =
      this.index.findByPath(
        path,
      );

    if (
      !node
    ) {

      throw new Error(
        `Unknown dependency path: ${path}`,
      );

    }

    return this.build(
      node,
    );

  }

  private build(
    node:
      ProjectDependencyNode,
  ):
    DependencyLookupResult {

    const incoming =
      this.index
        .incomingEdges(
          node.id,
        );

    const outgoing =
      this.index
        .outgoingEdges(
          node.id,
        );

    const dependencies =
      outgoing
        .map(
          edge =>
            this.index.findNode(
              edge.target,
            ),
        )
        .filter(
          Boolean,
        ) as
        ProjectDependencyNode[];

    const dependents =
      incoming
        .map(
          edge =>
            this.index.findNode(
              edge.source,
            ),
        )
        .filter(
          Boolean,
        ) as
        ProjectDependencyNode[];

    return {

      node,

      incoming,

      outgoing,

      dependencies,

      dependents,

    };

  }

  dependencyCount(
    id: string,
  ): number {

    return this
      .byId(
        id,
      )
      .dependencies
      .length;

  }

  dependentCount(
    id: string,
  ): number {

    return this
      .byId(
        id,
      )
      .dependents
      .length;

  }

  hasDependencies(
    id: string,
  ): boolean {

    return (
      this
        .dependencyCount(
          id,
        ) > 0
    );

  }

  hasDependents(
    id: string,
  ): boolean {

    return (
      this
        .dependentCount(
          id,
        ) > 0
    );

  }

}
