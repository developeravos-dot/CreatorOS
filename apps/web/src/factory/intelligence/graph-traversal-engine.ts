import type {
  ProjectDependencyNode,
} from "./project-deep-intelligence-interfaces";

import {
  GraphTraversal,
} from "./project-deep-intelligence-types";

import {
  DependencyGraphEngine,
} from "./dependency-graph-engine";

export interface TraversalResult {
  readonly visited:
    readonly string[];
  readonly order:
    readonly ProjectDependencyNode[];
}

export class GraphTraversalEngine {

  constructor(
    private readonly graph:
      DependencyGraphEngine,
  ) {}

  traverse(
    start: string,
    mode:
      GraphTraversal =
        GraphTraversal.DFS,
  ): TraversalResult {

    return mode ===
      GraphTraversal.DFS
      ? this.depthFirst(
          start,
        )
      : this.breadthFirst(
          start,
        );
  }

  private depthFirst(
    start: string,
  ): TraversalResult {

    const visited =
      new Set<string>();

    const order:
      ProjectDependencyNode[] =
      [];

    const walk = (
      id: string,
    ) => {

      if (
        visited.has(
          id,
        )
      ) {
        return;
      }

      visited.add(
        id,
      );

      const node =
        this.graph.node(
          id,
        );

      if (
        node
      ) {
        order.push(
          node,
        );
      }

      for (
        const next of
        this.graph.neighbors(
          id,
        )
      ) {
        walk(
          next.id,
        );
      }

    };

    walk(
      start,
    );

    return {
      visited:
        [
          ...visited,
        ],
      order,
    };
  }

  private breadthFirst(
    start: string,
  ): TraversalResult {

    const queue = [
      start,
    ];

    const visited =
      new Set<
        string
      >();

    const order:
      ProjectDependencyNode[] =
      [];

    while (
      queue.length >
      0
    ) {

      const current =
        queue.shift()!;

      if (
        visited.has(
          current,
        )
      ) {
        continue;
      }

      visited.add(
        current,
      );

      const node =
        this.graph.node(
          current,
        );

      if (
        node
      ) {
        order.push(
          node,
        );
      }

      for (
        const neighbor of
        this.graph.neighbors(
          current,
        )
      ) {

        if (
          !visited.has(
            neighbor.id,
          )
        ) {

          queue.push(
            neighbor.id,
          );

        }

      }

    }

    return {
      visited:
        [
          ...visited,
        ],
      order,
    };
  }

}
