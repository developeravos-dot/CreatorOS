import Redis, {
  Redis as IORedisClient,
} from 'ioredis';
import {
  RedisConnectionConfiguration,
} from '../configuration';
import {
  RedisConnection,
  RedisConnectionHealth,
  RedisConnectionStatus,
} from './redis-connection.interface';

export type IORedisClientFactory = (
  configuration: RedisConnectionConfiguration,
) => IORedisClient;

export class IORedisConnectionAdapter
  implements RedisConnection
{
  readonly configuration:
    Readonly<RedisConnectionConfiguration>;

  private client: IORedisClient | null = null;

  private currentStatus:
    RedisConnectionStatus = 'disconnected';

  constructor(
    configuration: RedisConnectionConfiguration,
    private readonly clientFactory:
      IORedisClientFactory =
        IORedisConnectionAdapter.createClient,
  ) {
    this.configuration = Object.freeze({
      ...configuration,
    });
  }

  get status(): RedisConnectionStatus {
    return this.currentStatus;
  }

  async connect(): Promise<void> {
    if (this.currentStatus === 'connected') {
      return;
    }

    if (this.currentStatus === 'closed') {
      throw new Error(
        'Closed Redis connections cannot reconnect.',
      );
    }

    this.currentStatus = 'connecting';

    try {
      const client = this.getOrCreateClient();

      if (client.status === 'wait') {
        await client.connect();
      }

      await client.ping();

      this.currentStatus = 'connected';
    } catch (error) {
      this.currentStatus = 'failed';
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.client) {
      this.currentStatus = 'closed';
      return;
    }

    await this.client.quit();

    this.currentStatus = 'closed';
    this.client = null;
  }

  async ping(): Promise<number> {
    const startedAt = performance.now();

    if (this.currentStatus !== 'connected') {
      await this.connect();
    }

    await this.getOrCreateClient().ping();

    return Math.max(
      0,
      performance.now() - startedAt,
    );
  }

  async getHealth():
    Promise<RedisConnectionHealth> {
    try {
      const latencyMs = await this.ping();

      return {
        status: this.currentStatus,
        connected:
          this.currentStatus === 'connected',
        latencyMs,
        checkedAt: new Date(),
      };
    } catch (error) {
      return {
        status: 'failed',
        connected: false,
        latencyMs: 0,
        checkedAt: new Date(),
        error:
          error instanceof Error
            ? error.message
            : String(error),
      };
    }
  }

  duplicate(): RedisConnection {
    return new IORedisConnectionAdapter(
      {
        ...this.configuration,
      },
      this.clientFactory,
    );
  }

  getNativeClient(): IORedisClient {
    return this.getOrCreateClient();
  }

  private getOrCreateClient(): IORedisClient {
    if (!this.client) {
      this.client = this.clientFactory({
        ...this.configuration,
      });
    }

    return this.client;
  }

  static createClient(
    configuration: RedisConnectionConfiguration,
  ): IORedisClient {
    return new Redis({
      host: configuration.host,
      port: configuration.port,
      db: configuration.database,
      username: configuration.username,
      password: configuration.password,
      connectTimeout:
        configuration.connectTimeoutMs,
      maxRetriesPerRequest:
        configuration.maxRetriesPerRequest,
      enableReadyCheck:
        configuration.enableReadyCheck,
      keyPrefix: configuration.keyPrefix,
      lazyConnect: true,
      ...(configuration.tls
        ? {
            tls: {},
          }
        : {}),
    });
  }
}
