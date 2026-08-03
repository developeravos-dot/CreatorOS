import type {
  ProjectDependencyEdge,
  ProjectDependencyNode,
} from "./project-deep-intelligence-interfaces";

import {
  DependencyGraphEngine,
} from "./dependency-graph-engine";

export interface WorkspaceDependency {

  readonly workspace:
    string;

  readonly dependencies:
    readonly string[];

  readonly dependents:
    readonly string[];

  readonly internalEdges:
    readonly ProjectDependencyEdge[];

  readonly externalEdges:
    readonly ProjectDependencyEdge[];

}

export interface WorkspaceDependencySummary {

  readonly workspaces:
    readonly WorkspaceDependency[];

  readonly totalWorkspaces:
    number;

  readonly totalInternalEdges:
    number;

  readonly totalExternalEdges:
    number;

}

export class WorkspaceDependencyEngine {

  constructor(
    private readonly graph:
      DependencyGraphEngine,
  ) {}

  analyze():
    WorkspaceDependencySummary {

    const dependencyGraph =
      this.graph.build();

    const workspaceMap =
      new Map<
        string,
        {
          nodes:
            ProjectDependencyNode[];
          internal:
            ProjectDependencyEdge[];
          external:
            ProjectDependencyEdge[];
          dependencies:
            Set<string>;
          dependents:
            Set<string>;
        }
      >();

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
      const node of
      dependencyGraph.nodes
    ) {

      if (
        !workspaceMap.has(
          node.workspace,
        )
      ) {

        workspaceMap.set(
          node.workspace,
          {
            nodes: [],
            internal: [],
            external: [],
            dependencies:
              new Set(),
            dependents:
              new Set(),
          },
        );

      }

      workspaceMap
        .get(
          node.workspace,
        )!
        .nodes.push(
          node,
        );

    }

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

      const workspace =
        workspaceMap.get(
          source.workspace,
        )!;

      if (
        edge.kind ===
        "external-package"
      ) {

        workspace.external.push(
          edge,
        );

        workspace.dependencies.add(
          edge.target,
        );

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

      workspace.internal.push(
        edge,
      );

      if (
        source.workspace !==
        target.workspace
      ) {

        workspace.dependencies.add(
          target.workspace,
        );

        workspaceMap
          .get(
            target.workspace,
          )
          ?.dependents.add(
            source.workspace,
          );

      }

    }

    const result =
      [
        ...workspaceMap.entries(),
      ].map(
        ([
          workspace,
          value,
        ]) => ({

          workspace,

          dependencies:
            [
              ...value.dependencies,
            ].sort(),

          dependents:
            [
              ...value.dependents,
            ].sort(),

          internalEdges:
            value.internal,

          externalEdges:
            value.external,

        }),
      );

    return {

      workspaces:
        result,

      totalWorkspaces:
        result.length,

      totalInternalEdges:
        result.reduce(
          (
            total,
            workspace,
          ) =>
            total +
            workspace
              .internalEdges
              .length,
          0,
        ),

      totalExternalEdges:
        result.reduce(
          (
            total,
            workspace,
          ) =>
            total +
            workspace
              .externalEdges
              .length,
          0,
        ),

    };

  }

  workspace(
    name: string,
  ) {

    return this
      .analyze()
      .workspaces
      .find(
        workspace =>
          workspace.workspace ===
          name,
      );

  }

}
