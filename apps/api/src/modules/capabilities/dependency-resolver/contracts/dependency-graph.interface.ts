import type {
  CapabilityIdentifier,
} from '../../contracts';
import type {
  DependencyGraphEdgeModel,
  DependencyGraphNodeModel,
  DependencyGraphSnapshot,
} from '../models';

export interface DependencyGraph {
  addNode(node: DependencyGraphNodeModel): void;

  addEdge(edge: DependencyGraphEdgeModel): void;

  getNode(
    capabilityId: CapabilityIdentifier,
  ): DependencyGraphNodeModel | undefined;

  hasNode(
    capabilityId: CapabilityIdentifier,
  ): boolean;

  getNodes(): readonly DependencyGraphNodeModel[];

  getEdges(): readonly DependencyGraphEdgeModel[];

  getOutgoingEdges(
    capabilityId: CapabilityIdentifier,
  ): readonly DependencyGraphEdgeModel[];

  getIncomingEdges(
    capabilityId: CapabilityIdentifier,
  ): readonly DependencyGraphEdgeModel[];

  getDependencies(
    capabilityId: CapabilityIdentifier,
  ): readonly DependencyGraphNodeModel[];

  getDependents(
    capabilityId: CapabilityIdentifier,
  ): readonly DependencyGraphNodeModel[];

  snapshot(): DependencyGraphSnapshot;
}