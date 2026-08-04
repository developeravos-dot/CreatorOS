import type {
  ClusterLeader,
  ClusterLock,
  ClusterMembershipEvent,
  ClusterNode,
  ClusterOwnership,
  ClusterSchedulerClaim,
} from '../../models';

export const REDIS_CLUSTER_ENTITY_TYPES = [
  'node',
  'membership-event',
  'leader',
  'lock',
  'coordination-state',
  'scheduler-claim',
  'ownership',
  'metric',
] as const;

export type RedisClusterEntityType =
  (typeof REDIS_CLUSTER_ENTITY_TYPES)[number];

export interface RedisClusterEntityMap {
  readonly node: ClusterNode;
  readonly 'membership-event':
    ClusterMembershipEvent;
  readonly leader: ClusterLeader;
  readonly lock: ClusterLock;
  readonly 'coordination-state': unknown;
  readonly 'scheduler-claim':
    ClusterSchedulerClaim;
  readonly ownership: ClusterOwnership;
  readonly metric:
    Readonly<Record<string, unknown>>;
}

export type RedisClusterEntityValue<
  TEntity extends RedisClusterEntityType,
> = RedisClusterEntityMap[TEntity];

export interface RedisClusterStoredRecord<
  TValue = unknown,
> {
  readonly schemaVersion: number;
  readonly entityType:
    RedisClusterEntityType;
  readonly key: string;
  readonly value: TValue;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly expiresAt: Date | null;
  readonly metadata:
    Readonly<Record<string, unknown>>;
}

export interface RedisClusterWriteOptions {
  readonly ttlMs?: number;
  readonly onlyIfAbsent?: boolean;
  readonly onlyIfPresent?: boolean;
  readonly expectedVersion?: number;
}

export interface RedisClusterScanOptions {
  readonly cursor?: string;
  readonly count?: number;
  readonly match?: string;
}

export interface RedisClusterScanResult<
  TValue = unknown,
> {
  readonly cursor: string;
  readonly records:
    readonly RedisClusterStoredRecord<TValue>[];
}

export interface RedisClusterCompareAndSetInput<
  TValue = unknown,
> {
  readonly key: string;
  readonly value: TValue;
  readonly expectedVersion: number;
  readonly ttlMs?: number;
  readonly metadata?:
    Readonly<Record<string, unknown>>;
}

export interface RedisClusterStore<
  TValue = unknown,
> {
  get(
    key: string,
  ): Promise<
    RedisClusterStoredRecord<TValue> | null
  >;

  set(
    record:
      RedisClusterStoredRecord<TValue>,
    options?:
      RedisClusterWriteOptions,
  ): Promise<boolean>;

  compareAndSet(
    input:
      RedisClusterCompareAndSetInput<TValue>,
  ): Promise<
    RedisClusterStoredRecord<TValue>
  >;

  delete(
    key: string,
  ): Promise<boolean>;

  exists(
    key: string,
  ): Promise<boolean>;

  scan(
    options?:
      RedisClusterScanOptions,
  ): Promise<
    RedisClusterScanResult<TValue>
  >;
}

export interface RedisClusterAtomicResult<
  TValue = unknown,
> {
  readonly applied: boolean;
  readonly value: TValue | null;
  readonly version: number | null;
}

export interface RedisClusterConnectionLike {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  ping(): Promise<number>;
  duplicate(): RedisClusterConnectionLike;
  getNativeClient(): unknown;
}