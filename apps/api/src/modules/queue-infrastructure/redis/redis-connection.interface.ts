import {
  RedisConnectionConfiguration,
} from '../configuration';

export type RedisConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'failed'
  | 'closed';

export interface RedisConnectionHealth {
  status: RedisConnectionStatus;
  connected: boolean;
  latencyMs: number;
  checkedAt: Date;
  error?: string;
}

export interface RedisConnection {
  readonly configuration:
    Readonly<RedisConnectionConfiguration>;

  readonly status: RedisConnectionStatus;

  connect(): Promise<void>;

  disconnect(): Promise<void>;

  ping(): Promise<number>;

  getHealth(): Promise<RedisConnectionHealth>;

  duplicate(): RedisConnection;
}

export interface RedisConnectionFactory {
  create(
    configuration: RedisConnectionConfiguration,
  ): RedisConnection;
}

export const REDIS_CONNECTION_FACTORY =
  Symbol('REDIS_CONNECTION_FACTORY');
