import {
  RedisClusterSerializer,
} from './redis-cluster-serializer';

describe(
  'RedisClusterSerializer',
  () => {
    const serializer =
      new RedisClusterSerializer();

    it(
      'serializes and restores nested dates',
      () => {
        const source = {
          createdAt:
            new Date(
              '2026-08-04T10:00:00.000Z',
            ),
          nested: {
            expiresAt:
              new Date(
                '2026-08-04T11:00:00.000Z',
              ),
          },
        };

        const restored =
          serializer.deserialize<
            typeof source
          >(
            serializer.serialize(
              source,
            ),
          );

        expect(restored)
          .toEqual(source);

        expect(
          restored.createdAt,
        ).toBeInstanceOf(Date);

        expect(
          restored.nested.expiresAt,
        ).toBeInstanceOf(Date);
      },
    );

    it(
      'supports bigint and undefined values',
      () => {
        const source = {
          fencingToken:
            9007199254740993n,
          optional:
            undefined,
        };

        const restored =
          serializer.clone(source);

        expect(
          restored.fencingToken,
        ).toBe(
          9007199254740993n,
        );

        expect(
          restored.optional,
        ).toBeUndefined();
      },
    );

    it(
      'returns independent cloned values',
      () => {
        const source = {
          nested: {
            count: 1,
          },
        };

        const restored =
          serializer.clone(source);

        expect(restored)
          .toEqual(source);

        expect(restored)
          .not.toBe(source);

        expect(restored.nested)
          .not.toBe(
            source.nested,
          );
      },
    );

    it(
      'rejects circular references',
      () => {
        const circular:
          Record<string, unknown> =
            {};

        circular.self =
          circular;

        expect(() =>
          serializer.serialize(
            circular,
          ),
        ).toThrow(
          'circular references',
        );
      },
    );

    it(
      'rejects invalid JSON payloads',
      () => {
        expect(() =>
          serializer.deserialize(
            '{invalid',
          ),
        ).toThrow(
          'not valid JSON',
        );
      },
    );
  },
);