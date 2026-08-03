import type {
  CapabilityIdentifier,
} from '../../contracts';
import type {
  DependencyResolverCatalogEntry,
} from './dependency-resolver.types';
import type {
  DependencyGraphModel,
} from '../models';

export interface DependencyGraphBuildRequest {
  readonly rootCapabilityId: CapabilityIdentifier;
  readonly catalog: readonly DependencyResolverCatalogEntry[];
  readonly includeOptional?: boolean;
}

export interface DependencyGraphBuilder {
  build(
    request: DependencyGraphBuildRequest,
  ): DependencyGraphModel;
}