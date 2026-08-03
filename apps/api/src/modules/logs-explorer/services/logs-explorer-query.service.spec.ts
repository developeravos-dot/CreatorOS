import {
  LogsExplorerEngineService,
} from './logs-explorer-engine.service';
import {
  LogsExplorerQueryService,
} from './logs-explorer-query.service';

describe(
  'LogsExplorerQueryService',
  () => {
    function setup() {
      const engine =
        new LogsExplorerEngineService();

      engine.record({
        id: 'log-1',
        level: 'info',
        source: 'runtime',
        context:
          'RuntimeEngine',
        message:
          'Runtime started.',
        timestamp:
          '2026-08-01T10:00:00.000Z',
        correlationId:
          'correlation-a',
        requestId:
          'request-a',
        traceId:
          'trace-a',
        spanId:
          'span-1',
        actor: {
          id: 'user-1',
          type: 'user',
        },
        resource: {
          id: 'runtime-1',
          type: 'runtime',
        },
        tags: [
          'startup',
        ],
      });

      engine.record({
        id: 'log-2',
        level: 'error',
        source: 'runtime',
        context:
          'RuntimeEngine',
        message:
          'Runtime failed.',
        timestamp:
          '2026-08-02T10:00:00.000Z',
        correlationId:
          'correlation-a',
        requestId:
          'request-b',
        traceId:
          'trace-a',
        spanId:
          'span-2',
        resource: {
          id: 'runtime-1',
          type: 'runtime',
        },
        error: {
          name:
            'RuntimeError',
          code:
            'RUNTIME_FAILED',
          message:
            'Runtime failed.',
        },
      });

      engine.record({
        id: 'log-3',
        level: 'fatal',
        source: 'database',
        context:
          'PersistenceService',
        message:
          'Database connection failed.',
        timestamp:
          '2026-08-03T10:00:00.000Z',
        correlationId:
          'correlation-b',
        traceId:
          'trace-b',
        spanId:
          'span-3',
        resource: {
          id: 'database-primary',
          type: 'database',
        },
        error: {
          name:
            'DatabaseError',
          code:
            'DB_UNAVAILABLE',
        },
      });

      return {
        engine,
        service:
          new LogsExplorerQueryService(
            engine,
          ),
      };
    }

    it(
      'searches entries by keyword',
      () => {
        const { service } =
          setup();

        const result =
          service.search({
            search:
              'connection failed',
          });

        expect(result.total).toBe(
          1,
        );

        expect(
          result.entries[0]?.id,
        ).toBe('log-3');
      },
    );

    it(
      'filters by level source and context',
      () => {
        const { service } =
          setup();

        const result =
          service.search({
            levels: [
              'error',
            ],
            sources: [
              'runtime',
            ],
            contexts: [
              'runtimeengine',
            ],
          });

        expect(result.total).toBe(
          1,
        );

        expect(
          result.entries[0]?.id,
        ).toBe('log-2');
      },
    );

    it(
      'filters by correlation request trace actor and resource',
      () => {
        const { service } =
          setup();

        expect(
          service.search({
            correlationId:
              'correlation-a',
          }).total,
        ).toBe(2);

        expect(
          service.search({
            requestId:
              'request-b',
          }).total,
        ).toBe(1);

        expect(
          service.search({
            traceId:
              'trace-a',
          }).total,
        ).toBe(2);

        expect(
          service.search({
            actorId:
              'user-1',
          }).total,
        ).toBe(1);

        expect(
          service.search({
            resourceId:
              'runtime-1',
          }).total,
        ).toBe(2);
      },
    );

    it(
      'filters by timestamp range',
      () => {
        const { service } =
          setup();

        const result =
          service.search({
            from:
              '2026-08-02T00:00:00.000Z',
            to:
              '2026-08-02T23:59:59.999Z',
          });

        expect(result.total).toBe(
          1,
        );

        expect(
          result.entries[0]?.id,
        ).toBe('log-2');
      },
    );

    it(
      'supports ascending and descending sorting',
      () => {
        const { service } =
          setup();

        expect(
          service.search({
            sortDirection:
              'desc',
          }).entries.map(
            (entry) =>
              entry.id,
          ),
        ).toEqual([
          'log-3',
          'log-2',
          'log-1',
        ]);

        expect(
          service.search({
            sortDirection:
              'asc',
          }).entries.map(
            (entry) =>
              entry.id,
          ),
        ).toEqual([
          'log-1',
          'log-2',
          'log-3',
        ]);
      },
    );

    it(
      'paginates entries',
      () => {
        const { service } =
          setup();

        const result =
          service.search({
            page: 2,
            pageSize: 1,
          });

        expect(result.count).toBe(
          1,
        );

        expect(result.total).toBe(
          3,
        );

        expect(
          result.pagination.page,
        ).toBe(2);

        expect(
          result.pagination
            .totalPages,
        ).toBe(3);

        expect(
          result.pagination
            .hasPreviousPage,
        ).toBe(true);

        expect(
          result.pagination
            .hasNextPage,
        ).toBe(true);
      },
    );

    it(
      'creates correlation groups',
      () => {
        const { service } =
          setup();

        const group =
          service.getCorrelationGroup(
            'correlation-a',
          );

        expect(
          group?.entryCount,
        ).toBe(2);

        expect(
          group?.firstTimestamp,
        ).toBe(
          '2026-08-01T10:00:00.000Z',
        );

        expect(
          group?.lastTimestamp,
        ).toBe(
          '2026-08-02T10:00:00.000Z',
        );

        expect(
          service
            .listCorrelationGroups(),
        ).toHaveLength(2);
      },
    );

    it(
      'creates trace groups',
      () => {
        const { service } =
          setup();

        const group =
          service.getTraceGroup(
            'trace-a',
          );

        expect(
          group?.entryCount,
        ).toBe(2);

        expect(
          group?.spanIds,
        ).toEqual([
          'span-1',
          'span-2',
        ]);

        expect(
          group?.correlationIds,
        ).toEqual([
          'correlation-a',
        ]);

        expect(
          service
            .listTraceGroups(),
        ).toHaveLength(2);
      },
    );

    it(
      'calculates search statistics',
      () => {
        const { service } =
          setup();

        const statistics =
          service.statistics();

        expect(
          statistics.totalMatched,
        ).toBe(3);

        expect(
          statistics.levels.error,
        ).toBe(1);

        expect(
          statistics.levels.fatal,
        ).toBe(1);

        expect(
          statistics.sources.runtime,
        ).toBe(2);

        expect(
          statistics.correlations,
        ).toBe(2);

        expect(
          statistics.traces,
        ).toBe(2);

        expect(
          statistics.errors,
        ).toBe(2);
      },
    );

    it(
      'creates an error summary',
      () => {
        const { service } =
          setup();

        const result =
          service.errorSummary();

        expect(result.total).toBe(
          2,
        );

        expect(
          result.levels.error,
        ).toBe(1);

        expect(
          result.levels.fatal,
        ).toBe(1);

        expect(
          result.sources.database,
        ).toBe(1);

        expect(
          result.entries.map(
            (entry) =>
              entry.id,
          ),
        ).toEqual([
          'log-3',
          'log-2',
        ]);
      },
    );

    it(
      'returns independent snapshots',
      () => {
        const { service } =
          setup();

        const first =
          service.search();

        const second =
          service.search();

        expect(first).not.toBe(
          second,
        );

        expect(first.entries)
          .not.toBe(
            second.entries,
          );

        expect(first.entries[0])
          .not.toBe(
            second.entries[0],
          );
      },
    );
  },
);