export const CLUSTER_NODE_ROLES = [
  'leader',
  'follower',
  'candidate',
  'observer',
] as const;

export type ClusterNodeRole =
  (typeof CLUSTER_NODE_ROLES)[number];

export const CLUSTER_NODE_STATES = [
  'joining',
  'active',
  'degraded',
  'draining',
  'offline',
  'removed',
] as const;

export type ClusterNodeState =
  (typeof CLUSTER_NODE_STATES)[number];

export const CLUSTER_MEMBERSHIP_EVENT_TYPES = [
  'node.joined',
  'node.updated',
  'node.heartbeat',
  'node.degraded',
  'node.draining',
  'node.offline',
  'node.removed',
  'leader.elected',
  'leader.revoked',
] as const;

export type ClusterMembershipEventType =
  (typeof CLUSTER_MEMBERSHIP_EVENT_TYPES)[number];

export const CLUSTER_LOCK_STATES = [
  'acquired',
  'renewed',
  'released',
  'expired',
] as const;

export type ClusterLockState =
  (typeof CLUSTER_LOCK_STATES)[number];

export const CLUSTER_OWNERSHIP_STATES = [
  'assigned',
  'renewed',
  'transferred',
  'released',
  'expired',
  'recovered',
] as const;

export type ClusterOwnershipState =
  (typeof CLUSTER_OWNERSHIP_STATES)[number];

export interface ClusterClock {
  now(): Date;
}

export interface ClusterNodeCapabilities {
  readonly queues: readonly string[];
  readonly jobTypes: readonly string[];
  readonly maximumConcurrency: number;
  readonly labels: Readonly<Record<string, string>>;
}

export interface RegisterClusterNodeInput {
  readonly nodeId: string;
  readonly instanceId: string;
  readonly host: string;
  readonly processId: number;
  readonly capabilities: ClusterNodeCapabilities;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly now?: Date;
}

export interface ClusterHeartbeatInput {
  readonly nodeId: string;
  readonly instanceId: string;
  readonly activeJobs: number;
  readonly completedJobs: number;
  readonly failedJobs: number;
  readonly memoryUsageBytes?: number;
  readonly cpuUsagePercent?: number;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly now?: Date;
}

export interface ClusterElectionRequest {
  readonly candidateNodeId: string;
  readonly term: number;
  readonly eligibleNodeIds: readonly string[];
  readonly currentLeaderNodeId?: string;
  readonly now?: Date;
}

export interface AcquireClusterLockInput {
  readonly resourceKey: string;
  readonly ownerNodeId: string;
  readonly leaseDurationMs: number;
  readonly fencingToken?: number;
  readonly now?: Date;
}

export interface AssignClusterOwnershipInput {
  readonly resourceType: string;
  readonly resourceId: string;
  readonly ownerNodeId: string;
  readonly leaseDurationMs: number;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly now?: Date;
}

export interface ClusterSchedulerClaimInput {
  readonly scheduleId: string;
  readonly nodeId: string;
  readonly executionKey: string;
  readonly leaseDurationMs: number;
  readonly now?: Date;
}