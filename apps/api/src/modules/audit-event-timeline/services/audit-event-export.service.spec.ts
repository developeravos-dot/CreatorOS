import {
  AuditEventEngineService,
} from './audit-event-engine.service';
import {
  AuditEventExportService,
} from './audit-event-export.service';
import {
  AuditEventQueryService,
} from './audit-event-query.service';

describe(
  'AuditEventExportService',
  () => {
    function setup() {
      const engine =
        new AuditEventEngineService();

      engine.record({
        id: 'event-json',
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
          '2026-08-01T00:00:00.000Z',
        correlationId:
          'correlation-one',
        metadata: {
          safe:
            'visible',
        },
      });

      engine.record({
        id: 'event-csv',
        eventType:
          'plugin.failed',
        category:
          'plugin',
        severity:
          'error',
        outcome:
          'failure',
        message:
          'Plugin failed, "unexpectedly".',
        occurredAt:
          '2026-08-02T00:00:00.000Z',
      });

      const query =
        new AuditEventQueryService(
          engine,
        );

      return new AuditEventExportService(
        query,
      );
    }

    it(
      'exports filtered JSON',
      () => {
        const service =
          setup();

        const result =
          service.export({
            format: 'json',
            query: {
              categories: [
                'runtime',
              ],
            },
          });

        expect(result.format).toBe(
          'json',
        );

        expect(
          result.contentType,
        ).toContain(
          'application/json',
        );

        expect(
          result.eventCount,
        ).toBe(1);

        const parsed =
          JSON.parse(
            result.content,
          ) as {
            eventCount: number;
            events:
              {
                id: string;
              }[];
          };

        expect(
          parsed.eventCount,
        ).toBe(1);

        expect(
          parsed.events[0]?.id,
        ).toBe('event-json');
      },
    );

    it(
      'exports CSV with headers and escaped values',
      () => {
        const service =
          setup();

        const result =
          service.export({
            format: 'csv',
          });

        expect(result.format).toBe(
          'csv',
        );

        expect(
          result.contentType,
        ).toContain(
          'text/csv',
        );

        expect(
          result.eventCount,
        ).toBe(2);

        expect(result.content).toContain(
          'id,occurredAt,recordedAt,eventType',
        );

        expect(result.content).toContain(
          '"Plugin failed, ""unexpectedly""."',
        );
      },
    );

    it(
      'does not reintroduce sanitized secrets',
      () => {
        const engine =
          new AuditEventEngineService();

        engine.record({
          eventType:
            'persistence.failed',
          category:
            'persistence',
          outcome:
            'failure',
          message:
            'TOKEN=secret-value',
          metadata: {
            password:
              'hidden-value',
          },
        });

        const service =
          new AuditEventExportService(
            new AuditEventQueryService(
              engine,
            ),
          );

        const json =
          service.export({
            format: 'json',
          });

        const csv =
          service.export({
            format: 'csv',
          });

        expect(json.content).not
          .toContain(
            'secret-value',
          );

        expect(json.content).not
          .toContain(
            'hidden-value',
          );

        expect(csv.content).not
          .toContain(
            'secret-value',
          );

        expect(csv.content).not
          .toContain(
            'hidden-value',
          );
      },
    );
  },
);