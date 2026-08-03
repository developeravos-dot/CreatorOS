import type {
  ProjectDependencyEdge,
  ProjectDependencyNode,
} from "./project-deep-intelligence-interfaces";

import {
  DependencyGraphEngine,
} from "./dependency-graph-engine";

export interface GraphIndex {

  readonly nodeCount:
    number;

  readonly edgeCount:
    number;

  readonly nodesById:
    ReadonlyMap<
      string,
      ProjectDependencyNode
    >;

  readonly nodesByPath:
    ReadonlyMap<
      string,
      ProjectDependencyNode
    >;

  readonly incoming:
    ReadonlyMap<
      string,
      readonly ProjectDependencyEdge[]
    >;

  readonly outgoing:
    ReadonlyMap<
      string,
      readonly ProjectDependencyEdge[]
    >;

}

export class GraphIndexEngine {

  constructor(
    private readonly graph:
      DependencyGraphEngine,
  ) {}

  build():
    GraphIndex {

    const graph =
      this.graph.build();

    const nodesById =
      new Map<
        string,
        ProjectDependencyNode
      >();

    const nodesByPath =
      new Map<
        string,
        ProjectDependencyNode
      >();

    const incoming =
      new Map<
        string,
        ProjectDependencyEdge[]
      >();

    const outgoing =
      new Map<
        string,
        ProjectDependencyEdge[]
      >();

    for (
      const node of
      graph.nodes
    ) {

      nodesById.set(
        node.id,
        node,
      );

      nodesByPath.set(
        node.path,
        node,
      );

      incoming.set(
        node.id,
        [],
      );

      outgoing.set(
        node.id,
        [],
      );

    }

    for (
      const edge of
      graph.edges
    ) {

      outgoing
        .get(
          edge.source,
        )
        ?.push(
          edge,
        );

      incoming
        .get(
          edge.target,
        )
        ?.push(
          edge,
        );

    }

    return {

      nodeCount:
        graph.nodes
          .length,

      edgeCount:
        graph.edges
          .length,

      nodesById,

      nodesByPath,

      incoming,

      outgoing,

    };

  }

  findNode(
    id: string,
  ) {

    return this
      .build()
      .nodesById
      .get(
        id,
      );

  }

  findByPath(
    path: string,
  ) {

    return this
      .build()
      .nodesByPath
      .get(
        path,
      );

  }

  incomingEdges(
    id: string,
  ) {

    return (
      this
        .build()
        .incoming
        .get(
          id,
        ) ??
      []
    );

  }

  outgoingEdges(
    id: string,
  ) {

    return (
      this
        .build()
        .outgoing
        .get(
          id,
        ) ??
      []
    );

  }

}
