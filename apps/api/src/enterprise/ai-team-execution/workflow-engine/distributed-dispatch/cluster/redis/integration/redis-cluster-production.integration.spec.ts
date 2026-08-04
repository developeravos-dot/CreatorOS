import type {
  RedisConnectionConfiguration,
} from '../../../../../../../modules/queue-infrastructure/configuration';
import {
  IORedisConnectionAdapter,
} from '../../../../../../../modules/queue-infrastructure/redis';
import {
  IORedisClusterStoreClientAdapter,
} from '../adapters';
import {
  RedisClusterKeyFactory,
} from '../key-factory';
import {
  RedisClusterNamespace,
} from '../namespace';
import {
  RedisClusterModule,
} from '../redis-cluster.module';

class FakeNativeRedisClient {
  status = 'wait';

  private readonly values =
    new Map<string, string>();

  private readonly counters =
    new Map<string, number>();

  async connect(): Promise<void> {
    this.status = 'ready';
  }

  async ping(): Promise<string> {
    return 'PONG';
  }

  async quit(): Promise<string> {
    this.status = 'end';
    return 'OK';
  }

  async get(key: string): Promise<string | null> {
    return this.values.get(key) ?? null;
  }

  async set(
    key: string,
    value: string,
    ...args: Array<string | number>
  ): Promise<string | null> {
    if (args.includes('NX') && this.values.has(key)) {
      return null;
    }

    if (args.includes('XX') && !this.values.has(key)) {
      return null;
    }

    this.values.set(key, value);
    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    let removed = 0;

    for (const key of keys) {
      if (this.values.delete(key)) {
        removed += 1;
      }
    }

    return removed;
  }

  async exists(key: string): Promise<number> {
    return this.values.has(key) ? 1 : 0;
  }

  async incr(key: string): Promise<number> {
    const next = (this.counters.get(key) ?? 0) + 1;
    this.counters.set(key, next);
    return next;
  }

  async mget(
    ...keys: string[]
  ): Promise<Array<string | null>> {
    return keys.map((key) =>
      this.values.get(key) ?? null,
    );
  }

  async scan(
    _cursor: string,
    ...args: Array<string | number>
  ): Promise<[string, string[]]> {
    const matchIndex = args.indexOf('MATCH');
    const pattern =
      matchIndex >= 0
        ? String(args[matchIndex + 1])
        : '*';

    const prefix = pattern.endsWith('*')
      ? pattern.slice(0, -1)
      : pattern;

    return [
      '0',
      [...this.values.keys()]
        .filter((key) => key.startsWith(prefix))
        .sort(),
    ];
  }
}

describe(
  'Production Redis cluster integration',
  () => {
    const configuration =
      {
        host: '127.0.0.1',
        port: 6379,
        database: 0,
        username: undefined,
        password: undefined,
        tls: false,
        connectTimeoutMs: 1_000,
        maxRetriesPerRequest: 1,
        enableReadyCheck: true,
        keyPrefix: '',
      } satisfies
        RedisConnectionConfiguration;

    it(
      'forwards Redis commands through the production adapter',
      async () => {
        const native =
          new FakeNativeRedisClient();

        const connection =
          new IORedisConnectionAdapter(
            configuration,
            () => native as never,
          );

        const adapter =
          new IORedisClusterStoreClientAdapter(
            connection,
          );

        await adapter.onModuleInit();

        await expect(
          adapter.set(
            'cluster:key',
            'value',
          ),
        ).resolves.toBe('OK');

        await expect(
          adapter.get('cluster:key'),
        ).resolves.toBe('value');

        await expect(
          adapter.incr(
            'cluster:sequence',
          ),
        ).resolves.toBe(1);

        await adapter.onModuleDestroy();

        expect(native.status).toBe('end');
      },
    );

    it(
      'builds the production dynamic module',
      () => {
        const module =
          RedisClusterModule.forRoot({
            connection: configuration,
            namespace: {
              application: 'creatoros',
              environment: 'integration',
              clusterId: 'production',
            },
          });

        expect(module.module)
          .toBe(RedisClusterModule);

        expect(module.providers)
          .toBeDefined();

        expect(module.exports)
          .toBeDefined();
      },
    );

    it(
      'isolates keys between clusters',
      () => {
        const first =
          new RedisClusterKeyFactory(
            new RedisClusterNamespace({
              application: 'creatoros',
              environment: 'production',
              clusterId: 'cluster-a',
            }),
          );

        const second =
          new RedisClusterKeyFactory(
            new RedisClusterNamespace({
              application: 'creatoros',
              environment: 'production',
              clusterId: 'cluster-b',
            }),
          );

        expect(first.leader())
          .not.toBe(second.leader());

        expect(first.node('node-one'))
          .not.toBe(
            second.node('node-one'),
          );
      },
    );
  },
);
