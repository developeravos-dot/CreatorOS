import {
  LogsExplorerEngineService,
} from './logs-explorer-engine.service';

describe(
  'LogsExplorerEngineService',
  () => {
    let engine:
      LogsExplorerEngineService;

    beforeEach(() => {
      engine =
        new LogsExplorerEngineService();
    });

    it(
      'records normalized log entries',
      () => {
        const entry =
          engine.record({
            id:
              ' log-one ',
            level:
              'info',
            source:
              'runtime',
            context:
              ' Runtime Engine ',
            message:
              ' Runtime started. ',
            correlationId:
              ' correlation-one ',
            requestId:
              ' request-one ',
            actor: {
              id:
                ' user-one ',
              type:
                'user',
              displayName:
                ' Operator ',
            },
            resource: {
              id:
                ' runtime-one ',
              type:
                'runtime',
            },
            tags: [
              'Runtime',
              'runtime',
              ' Startup ',
            ],
          });

        expect(entry.id).toBe(
          'log-one',
        );

        expect(entry.context).toBe(
          'Runtime Engine',
        );

        expect(entry.message).toBe(
          'Runtime started.',
        );

        expect(
          entry.correlationId,
        ).toBe(
          'correlation-one',
        );

        expect(entry.actor).toEqual({
          id: 'user-one',
          type: 'user',
          displayName:
            'Operator',
        });

        expect(entry.tags).toEqual([
          'runtime',
          'startup',
        ]);
      },
    );

    it(
      'provides level helper methods',
      () => {
        expect(
          engine.trace(
            'Trace message.',
          ).level,
        ).toBe('trace');

        expect(
          engine.debug(
            'Debug message.',
          ).level,
        ).toBe('debug');

        expect(
          engine.info(
            'Info message.',
          ).level,
        ).toBe('info');

        expect(
          engine.warn(
            'Warning message.',
          ).level,
        ).toBe('warn');

        expect(
          engine.error(
            'Error message.',
          ).level,
        ).toBe('error');

        expect(
          engine.fatal(
            'Fatal message.',
          ).level,
        ).toBe('fatal');
      },
    );

    it(
      'captures and sanitizes errors',
      () => {
        const error =
          new Error(
            'DATABASE_URL=postgresql://admin:password@localhost/database',
          );

        error.stack =
          'Error at C:\\Users\\User\\Desktop\\CreatorOS\\secret.ts';

        const entry =
          engine.error(
            'Operation failed.',
            error,
            'PersistenceService',
          );

        const serialized =
          JSON.stringify(entry);

        expect(serialized).not
          .toContain(
            'admin:password',
          );

        expect(serialized).not
          .toContain(
            'C:\\Users\\User',
          );

        expect(serialized).toContain(
          '[REDACTED',
        );
      },
    );

    it(
      'sanitizes metadata recursively',
      () => {
        const metadata:
          Record<string, unknown> =
            {
              token:
                'secret-token',
              nested: {
                password:
                  'secret-password',
                safe:
                  'visible',
              },
            };

        metadata.circular =
          metadata;

        const entry =
          engine.record({
            message:
              'Metadata test.',
            metadata,
          });

        const serialized =
          JSON.stringify(entry);

        expect(serialized).not
          .toContain(
            'secret-token',
          );

        expect(serialized).not
          .toContain(
            'secret-password',
          );

        expect(serialized).toContain(
          'visible',
        );

        expect(serialized).toContain(
          '[CIRCULAR_REFERENCE]',
        );
      },
    );

    it(
      'normalizes timestamps',
      () => {
        const valid =
          engine.record({
            message:
              'Valid timestamp.',
            timestamp:
              '2026-08-03T12:00:00.000Z',
          });

        expect(valid.timestamp).toBe(
          '2026-08-03T12:00:00.000Z',
        );

        const invalid =
          engine.record({
            message:
              'Invalid timestamp.',
            timestamp:
              'not-a-date',
          });

        expect(
          Number.isFinite(
            new Date(
              invalid.timestamp,
            ).getTime(),
          ),
        ).toBe(true);
      },
    );

    it(
      'returns independent snapshots',
      () => {
        const recorded =
          engine.record({
            id:
              'snapshot-one',
            message:
              'Snapshot.',
            metadata: {
              count: 1,
            },
          });

        const fetched =
          engine.getById(
            recorded.id,
          );

        expect(fetched).toEqual(
          recorded,
        );

        expect(fetched).not.toBe(
          recorded,
        );

        expect(
          fetched?.metadata,
        ).not.toBe(
          recorded.metadata,
        );
      },
    );

    it(
      'sorts entries by timestamp descending',
      () => {
        engine.record({
          id: 'older',
          message:
            'Older.',
          timestamp:
            '2026-08-01T00:00:00.000Z',
        });

        engine.record({
          id: 'newer',
          message:
            'Newer.',
          timestamp:
            '2026-08-02T00:00:00.000Z',
        });

        expect(
          engine.list().map(
            (entry) =>
              entry.id,
          ),
        ).toEqual([
          'newer',
          'older',
        ]);
      },
    );

    it(
      'rejects duplicate IDs',
      () => {
        engine.record({
          id: 'duplicate',
          message:
            'First.',
        });

        expect(() =>
          engine.record({
            id: 'duplicate',
            message:
              'Second.',
          }),
        ).toThrow(
          'already exists',
        );
      },
    );

    it(
      'rejects empty messages',
      () => {
        expect(() =>
          engine.record({
            message: ' ',
          }),
        ).toThrow(
          'message is required',
        );
      },
    );

    it(
      'calculates log engine metrics',
      () => {
        engine.record({
          level: 'info',
          source:
            'application',
          context:
            'Application',
          message:
            'Started.',
          correlationId:
            'correlation-one',
        });

        engine.record({
          level: 'error',
          source:
            'database',
          context:
            'PersistenceService',
          message:
            'Failed.',
        });

        const metrics =
          engine.metrics();

        expect(
          metrics.totalEntries,
        ).toBe(2);

        expect(
          metrics.levels.info,
        ).toBe(1);

        expect(
          metrics.levels.error,
        ).toBe(1);

        expect(
          metrics.sources.database,
        ).toBe(1);

        expect(
          metrics.correlatedEntries,
        ).toBe(1);

        expect(
          metrics.errorEntries,
        ).toBe(1);
      },
    );

    it(
      'clears all entries',
      () => {
        engine.info(
          'Entry.',
        );

        expect(engine.count()).toBe(
          1,
        );

        engine.clear();

        expect(engine.count()).toBe(
          0,
        );

        expect(engine.list()).toEqual(
          [],
        );
      },
    );
  },
);