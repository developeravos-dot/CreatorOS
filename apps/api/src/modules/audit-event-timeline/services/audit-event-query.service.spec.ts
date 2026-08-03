import {
  AuditEventEngineService,
} from './audit-event-engine.service';
import {
  AuditEventQueryService,
} from './audit-event-query.service';

describe(
  'AuditEventQueryService',
  () => {
    function setup() {
      const engine =
        new AuditEventEngineService();

      engine.record({
        id: 'event-1',
        eventType:
          'runtime.started',
        category:
          'runtime',
        severity:
          'info',
        outcome:
          'success',
        message:
          'Runtime started.',
        occurredAt:
          '2026-08-01T10:00:00.000Z',
        correlationId:
          'correlation-a',
        actor: {
          id: 'user-1',
          type: 'user',
          displayName:
            'Operator',
        },
        resource: {
          id:
            'runtime-1',
          type:
            'runtime',
          name:
            'Primary Runtime',
        },
        tags: [
          'runtime',
          'startup',
        ],
      });

      engine.record({
        id: 'event-2',
        eventType:
          'runtime.failed',
        category:
          'runtime',
        severity:
          'error',
        outcome:
          'failure',
        message:
          'Runtime failed.',
        occurredAt:
          '2026-08-02T10:00:00.000Z',
        correlationId:
          'correlation-a',
        causationId:
          'event-1',
        actor: {
          id: 'service-1',
          type: 'service',
        },
        resource: {
          id:
            'runtime-1',
          type:
            'runtime',
        },
      });

      engine.record({
        id: 'event-3',
        eventType:
          'plugin.activated',
        category:
          'plugin',
        severity:
          'info',
        outcome:
          'success',
        message:
          'Plugin activated.',
        occurredAt:
          '2026-08-03T10:00:00.000Z',
        correlationId:
          'correlation-b',
        resource: {
          id:
            'plugin-1',
          type:
            'plugin',
        },
      });

      return {
        engine,
        service:
          new AuditEventQueryService(
            engine,
          ),
      };
    }

    it(
      'searches events by keyword',
      () => {
        const { service } =
          setup();

        const result =
          service.search({
            search: 'failed',
          });

        expect(result.total).toBe(
          1,
        );

        expect(
          result.events[0]?.id,
        ).toBe('event-2');
      },
    );

    it(
      'filters by category severity and outcome',
      () => {
        const { service } =
          setup();

        const result =
          service.search({
            categories: [
              'runtime',
            ],
            severities: [
              'error',
            ],
            outcomes: [
              'failure',
            ],
          });

        expect(result.total).toBe(
          1,
        );

        expect(
          result.events[0]
            ?.eventType,
        ).toBe(
          'runtime.failed',
        );
      },
    );

    it(
      'filters by correlation actor and resource',
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
            actorId:
              'user-1',
          }).total,
        ).toBe(1);

        expect(
          service.search({
            resourceId:
              'runtime-1',
            resourceType:
              'runtime',
          }).total,
        ).toBe(2);
      },
    );

    it(
      'filters by time range',
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
          result.events[0]?.id,
        ).toBe('event-2');
      },
    );

    it(
      'supports ascending and descending sorting',
      () => {
        const { service } =
          setup();

        const descending =
          service.search({
            sortDirection:
              'desc',
          });

        expect(
          descending.events.map(
            (event) =>
              event.id,
          ),
        ).toEqual([
          'event-3',
          'event-2',
          'event-1',
        ]);

        const ascending =
          service.search({
            sortDirection:
              'asc',
          });

        expect(
          ascending.events.map(
            (event) =>
              event.id,
          ),
        ).toEqual([
          'event-1',
          'event-2',
          'event-3',
        ]);
      },
    );

    it(
      'paginates filtered events',
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
      'projects timeline entries',
      () => {
        const { service } =
          setup();

        const result =
          service.timeline({
            categories: [
              'runtime',
            ],
          });

        expect(result.total).toBe(
          2,
        );

        expect(
          result.entries[0],
        ).toEqual(
          expect.objectContaining({
            id: 'event-2',
            eventType:
              'runtime.failed',
          }),
        );

        expect(
          result.entries[0],
        ).not.toHaveProperty(
          'metadata',
        );
      },
    );

    it(
      'groups events by correlation ID',
      () => {
        const { service } =
          setup();

        const group =
          service.getCorrelationGroup(
            'correlation-a',
          );

        expect(
          group?.eventCount,
        ).toBe(2);

        expect(
          group?.firstOccurredAt,
        ).toBe(
          '2026-08-01T10:00:00.000Z',
        );

        expect(
          group?.lastOccurredAt,
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
      'finds related events without duplicates',
      () => {
        const { service } =
          setup();

        const result =
          service.relatedEvents(
            'event-1',
          );

        expect(
          result
            ?.relatedByCorrelation
            .map(
              (event) =>
                event.id,
            ),
        ).toContain(
          'event-2',
        );

        expect(
          result
            ?.relatedByCausation
            .map(
              (event) =>
                event.id,
            ),
        ).toContain(
          'event-2',
        );

        expect(
          result
            ?.relatedByResource
            .map(
              (event) =>
                event.id,
            ),
        ).toContain(
          'event-2',
        );

        expect(result?.count).toBe(
          1,
        );
      },
    );

    it(
      'calculates search statistics',
      () => {
        const { service } =
          setup();

        const statistics =
          service.statistics({
            categories: [
              'runtime',
            ],
          });

        expect(
          statistics.totalMatched,
        ).toBe(2);

        expect(
          statistics.categories
            .runtime,
        ).toBe(2);

        expect(
          statistics.severities
            .error,
        ).toBe(1);

        expect(
          statistics.correlations,
        ).toBe(1);
      },
    );

    it(
      'returns independent result snapshots',
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

        expect(first.events)
          .not.toBe(
            second.events,
          );

        expect(first.events[0])
          .not.toBe(
            second.events[0],
          );
      },
    );
  },
);