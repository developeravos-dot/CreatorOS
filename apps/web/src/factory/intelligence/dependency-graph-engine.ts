import type {
  ProjectDependencyEdge,
  ProjectDependencyGraph,
  ProjectDependencyNode,
} from "./project-deep-intelligence-interfaces";

import {
  DependencyEdgeModel,
  DependencyGraphModel,
  DependencyNodeModel,
} from "./project-deep-intelligence-models";

export class DependencyGraphEngine {

  private readonly nodes =
    new Map<
      string,
      ProjectDependencyNode
    >();

  private readonly outgoing =
    new Map<
      string,
      ProjectDependencyEdge[]
    >();

  private readonly incoming =
    new Map<
      string,
      ProjectDependencyEdge[]
    >();

  addNode(
    node:
      ProjectDependencyNode,
  ): void {

    this.nodes.set(
      node.id,
      node,
    );

    this.outgoing.set(
      node.id,
      [],
    );

    this.incoming.set(
      node.id,
      [],
    );
  }

  createNode(
    id: string,
    path: string,
    workspace: string,
    moduleName: string,
    directory: string,
    fileName: string,
    extension: string,
    language: string,
    category:
      ProjectDependencyNode["category"],
  ): ProjectDependencyNode {

    const node =
      new DependencyNodeModel(
        id,
        path,
        workspace,
        moduleName,
        directory,
        fileName,
        extension,
        language,
        category,
      );

    this.addNode(
      node,
    );

    return node;
  }

  addEdge(
    edge:
      ProjectDependencyEdge,
  ): void {

    if (
      !this.nodes.has(
        edge.source,
      )
    ) {
      throw new Error(
        "Unknown source node.",
      );
    }

    if (
      !this.nodes.has(
        edge.target,
      )
    ) {
      throw new Error(
        "Unknown target node.",
      );
    }

    this.outgoing
      .get(
        edge.source,
      )!
      .push(
        edge,
      );

    this.incoming
      .get(
        edge.target,
      )!
      .push(
        edge,
      );
  }

  connect(
    source: string,
    target: string,
    kind:
      ProjectDependencyEdge["kind"],
    optional = false,
  ): ProjectDependencyEdge {

    const edge =
      new DependencyEdgeModel(
        source,
        target,
        kind,
        optional,
      );

    this.addEdge(
      edge,
    );

    return edge;
  }

  node(
    id: string,
  ) {

    return this.nodes.get(
      id,
    );
  }

  outgoingEdges(
    id: string,
  ) {

    return [
      ...(
        this.outgoing.get(
          id,
        ) ?? []
      ),
    ];
  }

  incomingEdges(
    id: string,
  ) {

    return [
      ...(
        this.incoming.get(
          id,
        ) ?? []
      ),
    ];
  }

  neighbors(
    id: string,
  ) {

    return this
      .outgoingEdges(
        id,
      )
      .map(
        edge =>
          this.node(
            edge.target,
          ),
      )
      .filter(
        Boolean,
      ) as
      ProjectDependencyNode[];
  }

  build():
    ProjectDependencyGraph {

    return new DependencyGraphModel(
      [
        ...this.nodes.values(),
      ],
      [
        ...this.outgoing.values(),
      ].flat(),
    );
  }

  clear() {

    this.nodes.clear();

    this.outgoing.clear();

    this.incoming.clear();
  }

}
