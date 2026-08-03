import type {
  CircularDependency,
  ProjectDependencyEdge,
} from "./project-deep-intelligence-interfaces";

import {
  DependencyGraphEngine,
} from "./dependency-graph-engine";

export interface CircularDependencyAnalysis {

  readonly cycles:
    readonly CircularDependency[];

  readonly cycleCount:
    number;

  readonly longestCycle:
    number;

  readonly affectedModules:
    readonly string[];

}

export class CircularDependencyDetectionEngine {

  constructor(
    private readonly graph:
      DependencyGraphEngine,
  ) {}

  analyze():
    CircularDependencyAnalysis {

    const dependencyGraph =
      this.graph.build();

    const adjacency =
      new Map<
        string,
        string[]
      >();

    for (
      const node of
      dependencyGraph.nodes
    ) {

      adjacency.set(
        node.id,
        [],
      );

    }

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

      adjacency
        .get(
          edge.source,
        )
        ?.push(
          edge.target,
        );

    }

    const visited =
      new Set<string>();

    const stack:
      string[] =
      [];

    const stackSet =
      new Set<string>();

    const cycles:
      CircularDependency[] =
      [];

    const signatures =
      new Set<string>();

    const visit = (
      nodeId: string,
    ) => {

      visited.add(
        nodeId,
      );

      stack.push(
        nodeId,
      );

      stackSet.add(
        nodeId,
      );

      for (
        const next of
        adjacency.get(
          nodeId,
        ) ?? []
      ) {

        if (
          !visited.has(
            next,
          )
        ) {

          visit(
            next,
          );

          continue;

        }

        if (
          stackSet.has(
            next,
          )
        ) {

          const index =
            stack.indexOf(
              next,
            );

          const nodes =
            [
              ...stack.slice(
                index,
              ),
              next,
            ];

          const signature =
            [...nodes]
              .sort()
              .join(
                "|",
              );

          if (
            signatures.has(
              signature,
            )
          ) {
            continue;
          }

          signatures.add(
            signature,
          );

          const edges:
            ProjectDependencyEdge[] =
            [];

          for (
            let i = 0;
            i <
            nodes.length -
              1;
            i++
          ) {

            const edge =
              dependencyGraph.edges.find(
                candidate =>
                  candidate.source ===
                    nodes[
                      i
                    ] &&
                  candidate.target ===
                    nodes[
                      i + 1
                    ],
              );

            if (
              edge
            ) {

              edges.push(
                edge,
              );

            }

          }

          cycles.push({

            id:
              "cycle-" +
              (
                cycles
                  .length +
                1
              ),

            nodes,

            edges,

          });

        }

      }

      stack.pop();

      stackSet.delete(
        nodeId,
      );

    };

    for (
      const node of
      dependencyGraph.nodes
    ) {

      if (
        !visited.has(
          node.id,
        )
      ) {

        visit(
          node.id,
        );

      }

    }

    const affected =
      new Set<string>();

    let longest =
      0;

    for (
      const cycle of
      cycles
    ) {

      if (
        cycle.nodes
          .length >
        longest
      ) {

        longest =
          cycle.nodes
            .length;

      }

      for (
        const node of
        cycle.nodes
      ) {

        affected.add(
          node,
        );

      }

    }

    return {

      cycles,

      cycleCount:
        cycles.length,

      longestCycle:
        longest,

      affectedModules:
        [
          ...affected,
        ].sort(),

    };

  }

}
