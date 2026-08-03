import type {
  CapabilityIdentifier,
} from '../../contracts';
import type {
  DependencyGraph,
} from '../contracts';
import {
  DependencyGraphEdgeInvalidError,
  DependencyGraphNodeDuplicateError,
} from '../errors/dependency-resolver.errors';
import {
  DependencyGraphEdgeModel,
  type DependencyGraphEdgeSnapshot,
} from './dependency-graph-edge.model';
import {
  DependencyGraphNodeModel,
  type DependencyGraphNodeSnapshot,
} from './dependency-graph-node.model';

export interface DependencyGraphSnapshot {
  readonly nodes: readonly DependencyGraphNodeSnapshot[];
  readonly edges: readonly DependencyGraphEdgeSnapshot[];
}

export class DependencyGraphModel
  implements DependencyGraph
{
  private readonly nodes =
    new Map<CapabilityIdentifier, DependencyGraphNodeModel>();

  private readonly edges: DependencyGraphEdgeModel[] = [];

  addNode(node: DependencyGraphNodeModel): void {
    if (this.nodes.has(node.capabilityId)) {
      throw new DependencyGraphNodeDuplicateError(
        node.capabilityId,
      );
    }

    this.nodes.set(node.capabilityId, node);
  }

  addEdge(edge: DependencyGraphEdgeModel): void {
    if (
      !this.nodes.has(edge.sourceCapabilityId) ||
      !this.nodes.has(edge.targetCapabilityId)
    ) {
      throw new DependencyGraphEdgeInvalidError(
        edge.sourceCapabilityId,
        edge.targetCapabilityId,
      );
    }

    const duplicate = this.edges.some(
      (existing) =>
        existing.sourceCapabilityId ===
          edge.sourceCapabilityId &&
        existing.targetCapabilityId ===
          edge.targetCapabilityId &&
        existing.dependencyType ===
          edge.dependencyType,
    );

    if (!duplicate) {
      this.edges.push(edge);
    }
  }

  getNode(
    capabilityId: CapabilityIdentifier,
  ): DependencyGraphNodeModel | undefined {
    return this.nodes.get(capabilityId);
  }

  hasNode(
    capabilityId: CapabilityIdentifier,
  ): boolean {
    return this.nodes.has(capabilityId);
  }

  getNodes(): readonly DependencyGraphNodeModel[] {
    return [...this.nodes.values()];
  }

  getEdges(): readonly DependencyGraphEdgeModel[] {
    return [...this.edges];
  }

  getOutgoingEdges(
    capabilityId: CapabilityIdentifier,
  ): readonly DependencyGraphEdgeModel[] {
    return this.edges.filter(
      (edge) =>
        edge.sourceCapabilityId === capabilityId,
    );
  }

  getIncomingEdges(
    capabilityId: CapabilityIdentifier,
  ): readonly DependencyGraphEdgeModel[] {
    return this.edges.filter(
      (edge) =>
        edge.targetCapabilityId === capabilityId,
    );
  }

  getDependencies(
    capabilityId: CapabilityIdentifier,
  ): readonly DependencyGraphNodeModel[] {
    return this.getOutgoingEdges(capabilityId)
      .map((edge) =>
        this.nodes.get(edge.targetCapabilityId),
      )
      .filter(
        (
          node,
        ): node is DependencyGraphNodeModel =>
          node !== undefined,
      );
  }

  getDependents(
    capabilityId: CapabilityIdentifier,
  ): readonly DependencyGraphNodeModel[] {
    return this.getIncomingEdges(capabilityId)
      .map((edge) =>
        this.nodes.get(edge.sourceCapabilityId),
      )
      .filter(
        (
          node,
        ): node is DependencyGraphNodeModel =>
          node !== undefined,
      );
  }

  snapshot(): DependencyGraphSnapshot {
    return {
      nodes: this.getNodes().map((node) =>
        node.snapshot(),
      ),
      edges: this.getEdges().map((edge) =>
        edge.snapshot(),
      ),
    };
  }
}