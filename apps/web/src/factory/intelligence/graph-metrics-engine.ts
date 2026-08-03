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

export interface GraphMetrics {

  readonly nodeCount: number;

  readonly edgeCount: number;

  readonly isolatedNodes: number;

  readonly leafNodes: number;

  readonly rootNodes: number;

  readonly averageFanIn: number;

  readonly averageFanOut: number;

  readonly maxFanIn: number;

  readonly maxFanOut: number;

}

export interface NodeMetrics {

  readonly node:
    ProjectDependencyNode;

  readonly fanIn:
    number;

  readonly fanOut:
    number;

  readonly isRoot:
    boolean;

  readonly isLeaf:
    boolean;

  readonly isolated:
    boolean;

}

export class GraphMetricsEngine {

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

  metrics():
    GraphMetrics {

    const graph =
      this.index.build();

    let totalFanIn =
      0;

    let totalFanOut =
      0;

    let maxFanIn =
      0;

    let maxFanOut =
      0;

    let roots =
      0;

    let leaves =
      0;

    let isolated =
      0;

    for (
      const node of
      graph.nodesById.values()
    ) {

      const fanIn =
        (
          graph.incoming.get(
            node.id,
          ) ?? []
        ).length;

      const fanOut =
        (
          graph.outgoing.get(
            node.id,
          ) ?? []
        ).length;

      totalFanIn +=
        fanIn;

      totalFanOut +=
        fanOut;

      if (
        fanIn >
        maxFanIn
      ) {
        maxFanIn =
          fanIn;
      }

      if (
        fanOut >
        maxFanOut
      ) {
        maxFanOut =
          fanOut;
      }

      if (
        fanIn ===
        0
      ) {
        roots++;
      }

      if (
        fanOut ===
        0
      ) {
        leaves++;
      }

      if (
        fanIn === 0 &&
        fanOut === 0
      ) {
        isolated++;
      }

    }

    const count =
      graph.nodeCount ||
      1;

    return {

      nodeCount:
        graph.nodeCount,

      edgeCount:
        graph.edgeCount,

      isolatedNodes:
        isolated,

      leafNodes:
        leaves,

      rootNodes:
        roots,

      averageFanIn:
        totalFanIn /
        count,

      averageFanOut:
        totalFanOut /
        count,

      maxFanIn,

      maxFanOut,

    };

  }

  nodeMetrics(
    id: string,
  ):
    NodeMetrics {

    const graph =
      this.index.build();

    const node =
      graph.nodesById.get(
        id,
      );

    if (
      !node
    ) {

      throw new Error(
        `Unknown node: ${id}`,
      );

    }

    const fanIn =
      (
        graph.incoming.get(
          id,
        ) ?? []
      ).length;

    const fanOut =
      (
        graph.outgoing.get(
          id,
        ) ?? []
      ).length;

    return {

      node,

      fanIn,

      fanOut,

      isRoot:
        fanIn === 0,

      isLeaf:
        fanOut === 0,

      isolated:
        fanIn === 0 &&
        fanOut === 0,

    };

  }

  topDependencies(
    limit = 10,
  ):
    readonly NodeMetrics[] {

    const graph =
      this.index.build();

    return [
      ...graph.nodesById.values(),
    ]
      .map(
        node =>
          this.nodeMetrics(
            node.id,
          ),
      )
      .sort(
        (
          a,
          b,
        ) =>
          b.fanIn -
          a.fanIn,
      )
      .slice(
        0,
        limit,
      );

  }

  topDependents(
    limit = 10,
  ):
    readonly NodeMetrics[] {

    const graph =
      this.index.build();

    return [
      ...graph.nodesById.values(),
    ]
      .map(
        node =>
          this.nodeMetrics(
            node.id,
          ),
      )
      .sort(
        (
          a,
          b,
        ) =>
          b.fanOut -
          a.fanOut,
      )
      .slice(
        0,
        limit,
      );

  }

}
