import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import {
  IORedisConnectionAdapter,
} from '../../../../../../../modules/queue-infrastructure/redis';
import type {
  RedisClusterStoreClient,
} from '../stores';
import {
  REDIS_CLUSTER_CONNECTION,
} from '../tokens';

interface NativeRedisCommandClient {
  get(key: string): Promise<string | null>;
  set(
    key: string,
    value: string,
    ...args: Array<string | number>
  ): Promise<string | null>;
  del(...keys: string[]): Promise<number>;
  exists(key: string): Promise<number>;
  incr(key: string): Promise<number>;
  mget(...keys: string[]): Promise<Array<string | null>>;
  scan(
    cursor: string,
    ...args: Array<string | number>
  ): Promise<[string, string[]]>;
}

@Injectable()
export class IORedisClusterStoreClientAdapter
  implements
    RedisClusterStoreClient,
    OnModuleInit,
    OnModuleDestroy
{
  constructor(
    @Inject(REDIS_CLUSTER_CONNECTION)
    private readonly connection:
      IORedisConnectionAdapter,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.connection.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.connection.disconnect();
  }

  get(key: string): Promise<string | null> {
    return this.client().get(key);
  }

  set(
    key: string,
    value: string,
    ...args: Array<string | number>
  ): Promise<string | null> {
    return this.client().set(key, value, ...args);
  }

  del(...keys: string[]): Promise<number> {
    return this.client().del(...keys);
  }

  exists(key: string): Promise<number> {
    return this.client().exists(key);
  }

  incr(key: string): Promise<number> {
    return this.client().incr(key);
  }

  mget(
    ...keys: string[]
  ): Promise<Array<string | null>> {
    return this.client().mget(...keys);
  }

  scan(
    cursor: string,
    ...args: Array<string | number>
  ): Promise<[string, string[]]> {
    return this.client().scan(cursor, ...args);
  }

  private client(): NativeRedisCommandClient {
    return (
      this.connection.getNativeClient()
    ) as unknown as NativeRedisCommandClient;
  }
}
