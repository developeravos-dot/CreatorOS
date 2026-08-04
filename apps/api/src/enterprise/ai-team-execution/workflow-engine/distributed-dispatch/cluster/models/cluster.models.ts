import type {
  ClusterLockState,
  ClusterMembershipEventType,
  ClusterNodeCapabilities,
  ClusterNodeRole,
  ClusterNodeState,
  ClusterOwnershipState,
} from '../contracts';

export interface ClusterNode {
  readonly nodeId: string;
  readonly instanceId: string;
  readonly host: string;
  readonly processId: number;
  readonly role: ClusterNodeRole;
  readonly state: ClusterNodeState;
  readonly term: number;
  readonly capabilities: ClusterNodeCapabilities;
  readonly activeJobs: number;
  readonly completedJobs: number;
  readonly failedJobs: number;
  readonly memoryUsageBytes: number | null;
  readonly cpuUsagePercent: number | null;
  readonly joinedAt: Date;
  readonly lastHeartbeatAt: Date;
  readonly updatedAt: Date;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface ClusterMembershipEvent {
  readonly sequence: number;
  readonly type: ClusterMembershipEventType;
  readonly nodeId: string;
  readonly term: number;
  readonly occurredAt: Date;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface ClusterLeader {
  readonly nodeId: string;
  readonly instanceId: string;
  readonly term: number;
  readonly electedAt: Date;
  readonly leaseExpiresAt: Date;
}

export interface ClusterLock {
  readonly resourceKey: string;
  readonly ownerNodeId: string;
  readonly fencingToken: number;
  readonly state: ClusterLockState;
  readonly acquiredAt: Date;
  readonly renewedAt: Date;
  readonly expiresAt: Date;
  readonly releasedAt: Date | null;
}

export interface ClusterOwnership {
  readonly resourceType: string;
  readonly resourceId: string;
  readonly ownerNodeId: string;
  readonly previousOwnerNodeId: string | null;
  readonly fencingToken: number;
  readonly state: ClusterOwnershipState;
  readonly assignedAt: Date;
  readonly renewedAt: Date;
  readonly expiresAt: Date;
  readonly releasedAt: Date | null;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface ClusterSchedulerClaim {
  readonly scheduleId: string;
  readonly nodeId: string;
  readonly executionKey: string;
  readonly fencingToken: number;
  readonly claimedAt: Date;
  readonly expiresAt: Date;
  readonly completedAt: Date | null;
}

export interface ClusterHealthSnapshot {
  readonly status:
    | 'healthy'
    | 'degraded'
    | 'unhealthy';
  readonly leaderNodeId: string | null;
  readonly totalNodes: number;
  readonly activeNodes: number;
  readonly degradedNodes: number;
  readonly drainingNodes: number;
  readonly offlineNodes: number;
  readonly activeLocks: number;
  readonly activeOwnerships: number;
  readonly activeSchedulerClaims: number;
  readonly generatedAt: Date;
  readonly warnings: readonly string[];
}

export interface ClusterMetrics {
  readonly nodeJoins: number;
  readonly nodeRemovals: number;
  readonly leaderElections: number;
  readonly leaderFailovers: number;
  readonly lockAcquisitions: number;
  readonly lockConflicts: number;
  readonly ownershipAssignments: number;
  readonly ownershipTransfers: number;
  readonly ownershipRecoveries: number;
  readonly schedulerClaims: number;
  readonly duplicateExecutionsPrevented: number;
  readonly collectedAt: Date;
}

export function createEmptyClusterMetrics(
  collectedAt = new Date(),
): ClusterMetrics {
  return {
    nodeJoins: 0,
    nodeRemovals: 0,
    leaderElections: 0,
    leaderFailovers: 0,
    lockAcquisitions: 0,
    lockConflicts: 0,
    ownershipAssignments: 0,
    ownershipTransfers: 0,
    ownershipRecoveries: 0,
    schedulerClaims: 0,
    duplicateExecutionsPrevented: 0,
    collectedAt: new Date(collectedAt),
  };
}