import {
  NotFoundException,
} from '@nestjs/common';

import {
  AuditEventTimelineController,
} from './audit-event-timeline.controller';

describe(
  'AuditEventTimelineController',
  () => {
    function setup() {
      const event = {
        id: 'event-one',
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
          '2026-08-03T10:00:00.000Z',
        recordedAt:
          '2026-08-03T10:00:00.000Z',
        changes: [],
        metadata: {},
        tags: [],
      };

      const engine = {
        record:
          jest.fn(
            () => event,
          ),

        getById:
          jest.fn(
            () => event,
          ),
      };

      const query = {
        search:
          jest.fn(
            () => ({
              count: 1,
              total: 1,
              events: [
                event,
              ],
            }),
          ),

        timeline:
          jest.fn(
            () => ({
              count: 1,
              total: 1,
              entries: [
                {
                  id:
                    event.id,
                },
              ],
            }),
          ),

        listCorrelationGroups:
          jest.fn(
            () => [],
          ),

        getCorrelationGroup:
          jest.fn(
            () => ({
              correlationId:
                'correlation-one',
              eventCount: 1,
            }),
          ),

        statistics:
          jest.fn(
            () => ({
              totalMatched: 1,
            }),
          ),

        relatedEvents:
          jest.fn(
            () => ({
              sourceEvent:
                event,
              relatedByCorrelation:
                [],
              relatedByCausation:
                [],
              relatedByResource:
                [],
              count: 0,
            }),
          ),
      };

      const exporter = {
        export:
          jest.fn(
            () => ({
              format: 'json',
              eventCount: 1,
              content: '{}',
            }),
          ),
      };

      const controller =
        new AuditEventTimelineController(
          engine as never,
          query as never,
          exporter as never,
        );

      return {
        controller,
        engine,
        query,
        exporter,
        event,
      };
    }

    it(
      'delegates event listing and search',
      () => {
        const {
          controller,
          query,
        } = setup();

        controller.listEvents({});
        controller.search({});

        expect(
          query.search,
        ).toHaveBeenCalledTimes(2);
      },
    );

    it(
      'delegates timeline and statistics',
      () => {
        const {
          controller,
          query,
        } = setup();

        controller.timeline({});
        controller.statistics({});

        expect(
          query.timeline,
        ).toHaveBeenCalledTimes(1);

        expect(
          query.statistics,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      'delegates correlation operations',
      () => {
        const {
          controller,
          query,
        } = setup();

        controller.correlations();

        const result =
          controller.correlation(
            'correlation-one',
          );

        expect(
          query.listCorrelationGroups,
        ).toHaveBeenCalledTimes(1);

        expect(
          query.getCorrelationGroup,
        ).toHaveBeenCalledWith(
          'correlation-one',
        );

        expect(result).toEqual(
          expect.objectContaining({
            correlationId:
              'correlation-one',
          }),
        );
      },
    );

    it(
      'records audit events',
      () => {
        const {
          controller,
          engine,
        } = setup();

        const result =
          controller.record({
            eventType:
              'runtime.started',
            message:
              'Runtime started.',
          });

        expect(
          engine.record,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            eventType:
              'runtime.started',
            message:
              'Runtime started.',
          }),
        );

        expect(result.id).toBe(
          'event-one',
        );
      },
    );

    it(
      'returns event details and related events',
      () => {
        const {
          controller,
          engine,
          query,
        } = setup();

        expect(
          controller.eventDetails(
            'event-one',
          ),
        ).toEqual(
          expect.objectContaining({
            id: 'event-one',
          }),
        );

        expect(
          controller.relatedEvents(
            'event-one',
          ),
        ).toEqual(
          expect.objectContaining({
            count: 0,
          }),
        );

        expect(
          engine.getById,
        ).toHaveBeenCalledWith(
          'event-one',
        );

        expect(
          query.relatedEvents,
        ).toHaveBeenCalledWith(
          'event-one',
        );
      },
    );

    it(
      'delegates exports',
      () => {
        const {
          controller,
          exporter,
        } = setup();

        const result =
          controller.exportEvents({
            format: 'json',
            query: {
              category:
                'runtime',
            },
          });

        expect(
          exporter.export,
        ).toHaveBeenCalledTimes(1);

        expect(result.format).toBe(
          'json',
        );
      },
    );

    it(
      'throws for missing event details',
      () => {
        const controller =
          new AuditEventTimelineController(
            {
              getById:
                jest.fn(
                  () => undefined,
                ),
            } as never,
            {} as never,
            {} as never,
          );

        expect(() =>
          controller.eventDetails(
            'missing-event',
          ),
        ).toThrow(
          NotFoundException,
        );
      },
    );

    it(
      'throws for missing related event source',
      () => {
        const controller =
          new AuditEventTimelineController(
            {} as never,
            {
              relatedEvents:
                jest.fn(
                  () => undefined,
                ),
            } as never,
            {} as never,
          );

        expect(() =>
          controller.relatedEvents(
            'missing-event',
          ),
        ).toThrow(
          NotFoundException,
        );
      },
    );

    it(
      'throws for missing correlation groups',
      () => {
        const controller =
          new AuditEventTimelineController(
            {} as never,
            {
              getCorrelationGroup:
                jest.fn(
                  () => undefined,
                ),
            } as never,
            {} as never,
          );

        expect(() =>
          controller.correlation(
            'missing-correlation',
          ),
        ).toThrow(
          NotFoundException,
        );
      },
    );
  },
);