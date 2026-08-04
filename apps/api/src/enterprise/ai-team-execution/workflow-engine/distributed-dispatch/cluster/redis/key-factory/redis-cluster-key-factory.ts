import type {
  RedisClusterEntityType,
} from '../contracts';
import {
  RedisClusterNamespace,
} from '../namespace';

export class RedisClusterKeyFactory {
  constructor(
    readonly namespace:
      RedisClusterNamespace,
  ) {}

  node(
    nodeId: string,
  ): string {
    return this.namespace.qualify(
      'nodes',
      this.segment(
        nodeId,
        'nodeId',
      ),
    );
  }

  nodesPattern(): string {
    return this.namespace.pattern(
      'nodes',
    );
  }

  nodeHeartbeat(
    nodeId: string,
  ): string {
    return this.namespace.qualify(
      'heartbeats',
      this.segment(
        nodeId,
        'nodeId',
      ),
    );
  }

  heartbeatPattern(): string {
    return this.namespace.pattern(
      'heartbeats',
    );
  }

  membershipSequence(): string {
    return this.namespace.qualify(
      'membership',
      'sequence',
    );
  }

  membershipEvent(
    sequence: number,
  ): string {
    return this.namespace.qualify(
      'membership',
      'events',
      this.positiveInteger(
        sequence,
        'sequence',
      ),
    );
  }

  membershipEventsPattern(): string {
    return this.namespace.pattern(
      'membership',
      'events',
    );
  }

  leader(): string {
    return this.namespace.qualify(
      'leader',
      'current',
    );
  }

  leaderTerm(): string {
    return this.namespace.qualify(
      'leader',
      'term',
    );
  }

  fencingSequence(): string {
    return this.namespace.qualify(
      'fencing',
      'sequence',
    );
  }

  lock(
    resourceKey: string,
  ): string {
    return this.namespace.qualify(
      'locks',
      this.segment(
        resourceKey,
        'resourceKey',
      ),
    );
  }

  locksPattern(): string {
    return this.namespace.pattern(
      'locks',
    );
  }

  coordinationState(
    key: string,
  ): string {
    return this.namespace.qualify(
      'coordination',
      this.segment(
        key,
        'key',
      ),
    );
  }

  coordinationPattern(): string {
    return this.namespace.pattern(
      'coordination',
    );
  }

  schedulerClaim(
    executionKey: string,
  ): string {
    return this.namespace.qualify(
      'scheduler',
      'claims',
      this.segment(
        executionKey,
        'executionKey',
      ),
    );
  }

  schedulerClaimsPattern(): string {
    return this.namespace.pattern(
      'scheduler',
      'claims',
    );
  }

  ownership(
    resourceType: string,
    resourceId: string,
  ): string {
    return this.namespace.qualify(
      'ownership',
      this.segment(
        resourceType,
        'resourceType',
      ),
      this.segment(
        resourceId,
        'resourceId',
      ),
    );
  }

  ownershipPattern(
    resourceType?: string,
  ): string {
    if (resourceType === undefined) {
      return this.namespace.pattern(
        'ownership',
      );
    }

    return this.namespace.pattern(
      'ownership',
      this.segment(
        resourceType,
        'resourceType',
      ),
    );
  }

  metric(
    metricName: string,
  ): string {
    return this.namespace.qualify(
      'metrics',
      this.segment(
        metricName,
        'metricName',
      ),
    );
  }

  entity(
    entityType:
      RedisClusterEntityType,
    identifier: string,
  ): string {
    return this.namespace.qualify(
      'entities',
      entityType,
      this.segment(
        identifier,
        'identifier',
      ),
    );
  }

  private segment(
    value: string,
    fieldName: string,
  ): string {
    const trimmed =
      value.trim();

    if (!trimmed) {
      throw new Error(
        `${fieldName} is required.`,
      );
    }

    return Buffer
      .from(
        trimmed,
        'utf8',
      )
      .toString(
        'base64url',
      );
  }

  private positiveInteger(
    value: number,
    fieldName: string,
  ): string {
    if (
      !Number.isInteger(value) ||
      value < 1
    ) {
      throw new Error(
        `${fieldName} must be a positive integer.`,
      );
    }

    return String(value);
  }
}