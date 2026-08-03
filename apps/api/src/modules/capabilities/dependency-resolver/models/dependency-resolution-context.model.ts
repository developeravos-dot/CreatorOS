import type {
  CapabilityIdentifier,
  CapabilityMetadata,
} from '../../contracts';
import type {
  DependencyResolutionIssue,
  DependencyResolverCatalogEntry,
} from '../contracts';
import type {
  DependencyGraphModel,
} from './dependency-graph.model';

export class DependencyResolutionContextModel {
  private readonly issueList:
    DependencyResolutionIssue[] = [];

  private readonly visitedCapabilities =
    new Set<CapabilityIdentifier>();

  constructor(
    readonly rootCapabilityId: CapabilityIdentifier,
    readonly catalog:
      readonly DependencyResolverCatalogEntry[],
    readonly graph: DependencyGraphModel,
    readonly includeOptional: boolean,
    readonly enforcePeerDependencies: boolean,
    readonly metadata?: CapabilityMetadata,
  ) {}

  addIssue(issue: DependencyResolutionIssue): void {
    this.issueList.push(issue);
  }

  get issues(): readonly DependencyResolutionIssue[] {
    return [...this.issueList];
  }

  markVisited(
    capabilityId: CapabilityIdentifier,
  ): void {
    this.visitedCapabilities.add(capabilityId);
  }

  isVisited(
    capabilityId: CapabilityIdentifier,
  ): boolean {
    return this.visitedCapabilities.has(capabilityId);
  }

  get visited(): readonly CapabilityIdentifier[] {
    return [...this.visitedCapabilities];
  }
}