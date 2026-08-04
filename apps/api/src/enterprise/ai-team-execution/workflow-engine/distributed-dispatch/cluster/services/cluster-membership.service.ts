import {
  Injectable,
} from '@nestjs/common';

import type {
  ClusterHeartbeatInput,
  ClusterNodeRole,
  ClusterNodeState,
  RegisterClusterNodeInput,
} from '../contracts';
import type {
  ClusterMembershipEvent,
  ClusterNode,
} from '../models';

export interface ClusterMembershipMetrics {
  readonly registeredNodes: number;
  readonly activeNodes: number;
  readonly degradedNodes: number;
  readonly drainingNodes: number;
  readonly offlineNodes: number;
  readonly removedNodes: number;
  readonly heartbeatEvents: number;
  readonly membershipEvents: number;
  readonly collectedAt: Date;
}

@Injectable()
export class ClusterMembershipService {
  private readonly nodes =
    new Map<string, ClusterNode>();

  private readonly events:
    ClusterMembershipEvent[] = [];

  private nextSequence = 1;

  register(
    input:
      RegisterClusterNodeInput,
  ): ClusterNode {
    const nodeId =
      this.requireText(
        input.nodeId,
        'nodeId',
      );

    const instanceId =
      this.requireText(
        input.instanceId,
        'instanceId',
      );

    const host =
      this.requireText(
        input.host,
        'host',
      );

    if (
      !Number.isInteger(
        input.processId,
      ) ||
      input.processId < 1
    ) {
      throw new Error(
        'processId must be a positive integer.',
      );
    }

    if (
      !Number.isInteger(
        input.capabilities
          .maximumConcurrency,
      ) ||
      input.capabilities
        .maximumConcurrency < 1
    ) {
      throw new Error(
        'maximumConcurrency must be a positive integer.',
      );
    }

    const existing =
      this.nodes.get(nodeId);

    if (
      existing &&
      existing.state !== 'removed' &&
      existing.instanceId !== instanceId
    ) {
      throw new Error(
        `Cluster node ${nodeId} is already registered by instance ${existing.instanceId}.`,
      );
    }

    const now =
      new Date(
        input.now ??
        new Date(),
      );

    const node:
      ClusterNode = {
      nodeId,
      instanceId,
      host,
      processId:
        input.processId,
      role:
        existing?.role ??
        'follower',
      state: 'active',
      term:
        existing?.term ??
        0,
      capabilities:
        this.cloneCapabilities(
          input.capabilities,
        ),
      activeJobs:
        existing?.activeJobs ??
        0,
      completedJobs:
        existing?.completedJobs ??
        0,
      failedJobs:
        existing?.failedJobs ??
        0,
      memoryUsageBytes:
        existing?.memoryUsageBytes ??
        null,
      cpuUsagePercent:
        existing?.cpuUsagePercent ??
        null,
      joinedAt:
        existing?.joinedAt ??
        now,
      lastHeartbeatAt: now,
      updatedAt: now,
      metadata:
        this.cloneRecord(
          input.metadata ?? {},
        ),
    };

    this.nodes.set(
      nodeId,
      this.cloneNode(node),
    );

    this.appendEvent(
      existing
        ? 'node.updated'
        : 'node.joined',
      node,
      now,
      {
        instanceId,
        host,
      },
    );

    return this.cloneNode(node);
  }

  heartbeat(
    input:
      ClusterHeartbeatInput,
  ): ClusterNode {
    const nodeId =
      this.requireText(
        input.nodeId,
        'nodeId',
      );

    const node =
      this.requireNode(
        nodeId,
      );

    if (
      node.instanceId !==
      input.instanceId
    ) {
      throw new Error(
        `Heartbeat instance mismatch for node ${nodeId}.`,
      );
    }

    if (
      node.state === 'removed'
    ) {
      throw new Error(
        `Removed node ${nodeId} cannot send heartbeats.`,
      );
    }

    const now =
      new Date(
        input.now ??
        new Date(),
      );

    const activeJobs =
      this.requireNonNegativeInteger(
        input.activeJobs,
        'activeJobs',
      );

    const completedJobs =
      this.requireNonNegativeInteger(
        input.completedJobs,
        'completedJobs',
      );

    const failedJobs =
      this.requireNonNegativeInteger(
        input.failedJobs,
        'failedJobs',
      );

    const cpuUsagePercent =
      input.cpuUsagePercent ===
      undefined
        ? node.cpuUsagePercent
        : this.normalizePercentage(
            input.cpuUsagePercent,
            'cpuUsagePercent',
          );

    const memoryUsageBytes =
      input.memoryUsageBytes ===
      undefined
        ? node.memoryUsageBytes
        : this.requireNonNegativeInteger(
            input.memoryUsageBytes,
            'memoryUsageBytes',
          );

    const state:
      ClusterNodeState =
        node.state === 'draining'
          ? 'draining'
          : 'active';

    const updated:
      ClusterNode = {
      ...node,
      state,
      activeJobs,
      completedJobs,
      failedJobs,
      memoryUsageBytes,
      cpuUsagePercent,
      lastHeartbeatAt: now,
      updatedAt: now,
      metadata: {
        ...node.metadata,
        ...this.cloneRecord(
          input.metadata ?? {},
        ),
      },
    };

    this.nodes.set(
      nodeId,
      this.cloneNode(updated),
    );

    this.appendEvent(
      'node.heartbeat',
      updated,
      now,
      {
        activeJobs,
        completedJobs,
        failedJobs,
      },
    );

    return this.cloneNode(updated);
  }

  discover():
    readonly ClusterNode[] {
    return this.list().filter(
      (node) =>
        node.state !== 'removed',
    );
  }

  detectOfflineNodes(
    maximumHeartbeatAgeMs: number,
    now =
      new Date(),
  ): readonly ClusterNode[] {
    if (
      !Number.isInteger(
        maximumHeartbeatAgeMs,
      ) ||
      maximumHeartbeatAgeMs < 1
    ) {
      throw new Error(
        'maximumHeartbeatAgeMs must be a positive integer.',
      );
    }

    const currentTime =
      new Date(now);

    const offlineNodes:
      ClusterNode[] = [];

    for (
      const node
      of this.nodes.values()
    ) {
      if (
        node.state === 'removed' ||
        node.state === 'offline'
      ) {
        continue;
      }

      const heartbeatAgeMs =
        currentTime.getTime() -
        node.lastHeartbeatAt
          .getTime();

      if (
        heartbeatAgeMs <=
        maximumHeartbeatAgeMs
      ) {
        continue;
      }

      const updated:
        ClusterNode = {
        ...node,
        role:
          node.role === 'leader'
            ? 'follower'
            : node.role,
        state: 'offline',
        updatedAt:
          currentTime,
      };

      this.nodes.set(
        node.nodeId,
        this.cloneNode(updated),
      );

      this.appendEvent(
        'node.offline',
        updated,
        currentTime,
        {
          heartbeatAgeMs,
        },
      );

      offlineNodes.push(
        this.cloneNode(updated),
      );
    }

    return offlineNodes;
  }

  markDegraded(
    nodeId: string,
    now =
      new Date(),
  ): ClusterNode {
    return this.changeState(
      nodeId,
      'degraded',
      'node.degraded',
      now,
    );
  }

  markDraining(
    nodeId: string,
    now =
      new Date(),
  ): ClusterNode {
    return this.changeState(
      nodeId,
      'draining',
      'node.draining',
      now,
    );
  }

  markOffline(
    nodeId: string,
    now =
      new Date(),
  ): ClusterNode {
    return this.changeState(
      nodeId,
      'offline',
      'node.offline',
      now,
    );
  }

  remove(
    nodeId: string,
    now =
      new Date(),
  ): ClusterNode {
    const node =
      this.requireNode(
        this.requireText(
          nodeId,
          'nodeId',
        ),
      );

    const updatedAt =
      new Date(now);

    const updated:
      ClusterNode = {
      ...node,
      role: 'follower',
      state: 'removed',
      activeJobs: 0,
      updatedAt,
    };

    this.nodes.set(
      node.nodeId,
      this.cloneNode(updated),
    );

    this.appendEvent(
      'node.removed',
      updated,
      updatedAt,
      {},
    );

    return this.cloneNode(updated);
  }

  setRole(
    nodeId: string,
    role: ClusterNodeRole,
    term: number,
    now =
      new Date(),
  ): ClusterNode {
    const node =
      this.requireNode(
        this.requireText(
          nodeId,
          'nodeId',
        ),
      );

    if (
      !Number.isInteger(term) ||
      term < node.term
    ) {
      throw new Error(
        `Cluster term must be an integer greater than or equal to ${node.term}.`,
      );
    }

    if (
      node.state !== 'active' &&
      role === 'leader'
    ) {
      throw new Error(
        `Only active nodes can become leader. Node ${node.nodeId} is ${node.state}.`,
      );
    }

    const updatedAt =
      new Date(now);

    const updated:
      ClusterNode = {
      ...node,
      role,
      term,
      updatedAt,
    };

    this.nodes.set(
      node.nodeId,
      this.cloneNode(updated),
    );

    return this.cloneNode(updated);
  }

  get(
    nodeId: string,
  ): ClusterNode | null {
    const normalizedNodeId =
      this.requireText(
        nodeId,
        'nodeId',
      );

    const node =
      this.nodes.get(
        normalizedNodeId,
      );

    return node
      ? this.cloneNode(node)
      : null;
  }

  require(
    nodeId: string,
  ): ClusterNode {
    return this.cloneNode(
      this.requireNode(
        this.requireText(
          nodeId,
          'nodeId',
        ),
      ),
    );
  }

  list():
    readonly ClusterNode[] {
    return [
      ...this.nodes.values(),
    ]
      .sort(
        (left, right) =>
          left.nodeId.localeCompare(
            right.nodeId,
          ),
      )
      .map(
        (node) =>
          this.cloneNode(node),
      );
  }

  listEvents(
    nodeId?: string,
  ): readonly ClusterMembershipEvent[] {
    const normalizedNodeId =
      nodeId === undefined
        ? null
        : this.requireText(
            nodeId,
            'nodeId',
          );

    return this.events
      .filter(
        (event) =>
          normalizedNodeId ===
            null ||
          event.nodeId ===
            normalizedNodeId,
      )
      .map(
        (event) =>
          this.cloneEvent(event),
      );
  }

  getMetrics(
    collectedAt =
      new Date(),
  ): ClusterMembershipMetrics {
    const nodes =
      [...this.nodes.values()];

    return {
      registeredNodes:
        nodes.length,
      activeNodes:
        nodes.filter(
          (node) =>
            node.state === 'active',
        ).length,
      degradedNodes:
        nodes.filter(
          (node) =>
            node.state === 'degraded',
        ).length,
      drainingNodes:
        nodes.filter(
          (node) =>
            node.state === 'draining',
        ).length,
      offlineNodes:
        nodes.filter(
          (node) =>
            node.state === 'offline',
        ).length,
      removedNodes:
        nodes.filter(
          (node) =>
            node.state === 'removed',
        ).length,
      heartbeatEvents:
        this.events.filter(
          (event) =>
            event.type ===
            'node.heartbeat',
        ).length,
      membershipEvents:
        this.events.length,
      collectedAt:
        new Date(collectedAt),
    };
  }

  private changeState(
    nodeId: string,
    state: ClusterNodeState,
    eventType:
      | 'node.degraded'
      | 'node.draining'
      | 'node.offline',
    now: Date,
  ): ClusterNode {
    const node =
      this.requireNode(
        this.requireText(
          nodeId,
          'nodeId',
        ),
      );

    if (
      node.state === 'removed'
    ) {
      throw new Error(
        `Removed node ${node.nodeId} cannot change state.`,
      );
    }

    const updatedAt =
      new Date(now);

    const updated:
      ClusterNode = {
      ...node,
      role:
        state === 'offline' &&
        node.role === 'leader'
          ? 'follower'
          : node.role,
      state,
      updatedAt,
    };

    this.nodes.set(
      node.nodeId,
      this.cloneNode(updated),
    );

    this.appendEvent(
      eventType,
      updated,
      updatedAt,
      {},
    );

    return this.cloneNode(updated);
  }

  private appendEvent(
    type:
      ClusterMembershipEvent['type'],
    node: ClusterNode,
    occurredAt: Date,
    payload:
      Readonly<Record<string, unknown>>,
  ): void {
    this.events.push({
      sequence:
        this.nextSequence,
      type,
      nodeId:
        node.nodeId,
      term:
        node.term,
      occurredAt:
        new Date(occurredAt),
      payload:
        this.cloneRecord(payload),
    });

    this.nextSequence += 1;
  }

  private requireNode(
    nodeId: string,
  ): ClusterNode {
    const node =
      this.nodes.get(nodeId);

    if (!node) {
      throw new Error(
        `Cluster node ${nodeId} was not found.`,
      );
    }

    return node;
  }

  private requireText(
    value: string,
    fieldName: string,
  ): string {
    const normalized =
      value.trim();

    if (!normalized) {
      throw new Error(
        `${fieldName} is required.`,
      );
    }

    return normalized;
  }

  private requireNonNegativeInteger(
    value: number,
    fieldName: string,
  ): number {
    if (
      !Number.isInteger(value) ||
      value < 0
    ) {
      throw new Error(
        `${fieldName} must be a non-negative integer.`,
      );
    }

    return value;
  }

  private normalizePercentage(
    value: number,
    fieldName: string,
  ): number {
    if (
      !Number.isFinite(value) ||
      value < 0 ||
      value > 100
    ) {
      throw new Error(
        `${fieldName} must be between 0 and 100.`,
      );
    }

    return value;
  }

  private cloneNode(
    node: ClusterNode,
  ): ClusterNode {
    return {
      ...node,
      capabilities:
        this.cloneCapabilities(
          node.capabilities,
        ),
      joinedAt:
        new Date(node.joinedAt),
      lastHeartbeatAt:
        new Date(
          node.lastHeartbeatAt,
        ),
      updatedAt:
        new Date(node.updatedAt),
      metadata:
        this.cloneRecord(
          node.metadata,
        ),
    };
  }

  private cloneCapabilities(
    capabilities:
      ClusterNode['capabilities'],
  ): ClusterNode['capabilities'] {
    return {
      queues: [
        ...capabilities.queues,
      ],
      jobTypes: [
        ...capabilities.jobTypes,
      ],
      maximumConcurrency:
        capabilities
          .maximumConcurrency,
      labels: {
        ...capabilities.labels,
      },
    };
  }

  private cloneEvent(
    event:
      ClusterMembershipEvent,
  ): ClusterMembershipEvent {
    return {
      ...event,
      occurredAt:
        new Date(
          event.occurredAt,
        ),
      payload:
        this.cloneRecord(
          event.payload,
        ),
    };
  }

  private cloneRecord(
    value:
      Readonly<Record<string, unknown>>,
  ): Readonly<Record<string, unknown>> {
    return {
      ...value,
    };
  }
}