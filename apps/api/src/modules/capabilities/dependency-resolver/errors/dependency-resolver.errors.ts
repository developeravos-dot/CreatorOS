export class DependencyResolverError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly details?: Readonly<Record<string, unknown>>,
  ) {
    super(message);
    this.name = 'DependencyResolverError';
  }
}

export class DependencyRootCapabilityNotFoundError
  extends DependencyResolverError
{
  constructor(capabilityId: string) {
    super(
      `Root capability "${capabilityId}" was not found in the dependency catalog.`,
      'DEPENDENCY_ROOT_CAPABILITY_NOT_FOUND',
      { capabilityId },
    );

    this.name = 'DependencyRootCapabilityNotFoundError';
  }
}

export class DependencyGraphNodeDuplicateError
  extends DependencyResolverError
{
  constructor(capabilityId: string) {
    super(
      `Dependency graph node "${capabilityId}" already exists.`,
      'DEPENDENCY_GRAPH_NODE_DUPLICATE',
      { capabilityId },
    );

    this.name = 'DependencyGraphNodeDuplicateError';
  }
}

export class DependencyGraphNodeNotFoundError
  extends DependencyResolverError
{
  constructor(capabilityId: string) {
    super(
      `Dependency graph node "${capabilityId}" was not found.`,
      'DEPENDENCY_GRAPH_NODE_NOT_FOUND',
      { capabilityId },
    );

    this.name = 'DependencyGraphNodeNotFoundError';
  }
}

export class DependencyGraphEdgeInvalidError
  extends DependencyResolverError
{
  constructor(
    sourceCapabilityId: string,
    targetCapabilityId: string,
  ) {
    super(
      `Dependency graph edge "${sourceCapabilityId}" -> "${targetCapabilityId}" is invalid.`,
      'DEPENDENCY_GRAPH_EDGE_INVALID',
      {
        sourceCapabilityId,
        targetCapabilityId,
      },
    );

    this.name = 'DependencyGraphEdgeInvalidError';
  }
}