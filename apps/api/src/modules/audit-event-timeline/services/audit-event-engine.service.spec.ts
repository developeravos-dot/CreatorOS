import {
  AuditEventEngineService,
} from './audit-event-engine.service';

describe(
  'AuditEventEngineService',
  () => {
    let engine:
      AuditEventEngineService;

    beforeEach(() => {
      engine =
        new AuditEventEngineService();
    });

    it(
      'records normalized audit events',
      () => {
        const event =
          engine.record({
            eventType:
              ' capability.started ',
            category:
              'capability',
            outcome:
              'success',
            message:
              ' Capability started successfully. ',
            correlationId:
              ' correlation-one ',
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
                ' capability-one ',
              type:
                'capability',
            },
            tags: [
              'Runtime',
              'runtime',
              ' Success ',
            ],
          });

        expect(event.eventType).toBe(
          'capability.started',
        );

        expect(event.message).toBe(
          'Capability started successfully.',
        );

        expect(event.severity).toBe(
          'info',
        );

        expect(
          event.correlationId,
        ).toBe('correlation-one');

        expect(event.actor).toEqual({
          id: 'user-one',
          type: 'user',
          displayName:
            'Operator',
        });

        expect(event.tags).toEqual([
          'runtime',
          'success',
        ]);
      },
    );

    it(
      'assigns failure severity automatically',
      () => {
        const event =
          engine.record({
            eventType:
              'plugin.activation-failed',
            category:
              'plugin',
            outcome:
              'failure',
            message:
              'Activation failed.',
          });

        expect(event.severity).toBe(
          'error',
        );
      },
    );

    it(
      'uses explicit severity when supplied',
      () => {
        const event =
          engine.record({
            eventType:
              'security.violation',
            category:
              'security',
            outcome:
              'failure',
            severity:
              'critical',
            message:
              'Security violation.',
          });

        expect(event.severity).toBe(
          'critical',
        );
      },
    );

    it(
      'sanitizes secrets from messages metadata and changes',
      () => {
        const event =
          engine.record({
            eventType:
              'persistence.failure',
            category:
              'persistence',
            outcome:
              'failure',
            message:
              'DATABASE_URL=postgresql://admin:password@localhost:5432/database TOKEN=secret-token',
            metadata: {
              apiKey:
                'secret-api-key',
              nested: {
                password:
                  'secret-password',
                safe:
                  'visible-value',
              },
            },
            changes: [
              {
                field:
                  'configuration',
                previousValue: {
                  authorization:
                    'Bearer secret-token',
                },
                currentValue: {
                  status:
                    'disabled',
                },
              },
            ],
          });

        const serialized =
          JSON.stringify(event);

        expect(serialized).not
          .toContain(
            'admin:password',
          );

        expect(serialized).not
          .toContain(
            'secret-api-key',
          );

        expect(serialized).not
          .toContain(
            'secret-password',
          );

        expect(serialized).not
          .toContain(
            'secret-token',
          );

        expect(serialized).toContain(
          '[REDACTED',
        );

        expect(serialized).toContain(
          'visible-value',
        );
      },
    );

    it(
      'handles circular metadata safely',
      () => {
        const metadata:
          Record<string, unknown> =
            {
              name: 'audit',
            };

        metadata.self =
          metadata;

        const event =
          engine.record({
            eventType:
              'system.circular-data',
            message:
              'Circular payload.',
            metadata,
          });

        expect(
          JSON.stringify(
            event.metadata,
          ),
        ).toContain(
          '[CIRCULAR_REFERENCE]',
        );
      },
    );

    it(
      'normalizes valid timestamps and falls back for invalid values',
      () => {
        const valid =
          engine.record({
            eventType:
              'system.valid-time',
            message:
              'Valid timestamp.',
            occurredAt:
              '2026-08-03T12:00:00.000Z',
          });

        expect(valid.occurredAt).toBe(
          '2026-08-03T12:00:00.000Z',
        );

        const invalid =
          engine.record({
            eventType:
              'system.invalid-time',
            message:
              'Invalid timestamp.',
            occurredAt:
              'not-a-date',
          });

        expect(
          Number.isFinite(
            new Date(
              invalid.occurredAt,
            ).getTime(),
          ),
        ).toBe(true);
      },
    );

    it(
      'returns independent event snapshots',
      () => {
        const event =
          engine.record({
            id: 'event-one',
            eventType:
              'runtime.started',
            category:
              'runtime',
            message:
              'Runtime started.',
            metadata: {
              instanceId:
                'runtime-one',
            },
          });

        const fetched =
          engine.getById(
            event.id,
          );

        expect(fetched).toEqual(
          event,
        );

        expect(fetched).not.toBe(
          event,
        );

        expect(
          fetched?.metadata,
        ).not.toBe(
          event.metadata,
        );
      },
    );

    it(
      'orders events by occurrence time descending',
      () => {
        engine.record({
          id: 'older',
          eventType:
            'system.older',
          message:
            'Older event.',
          occurredAt:
            '2026-08-01T00:00:00.000Z',
        });

        engine.record({
          id: 'newer',
          eventType:
            'system.newer',
          message:
            'Newer event.',
          occurredAt:
            '2026-08-02T00:00:00.000Z',
        });

        expect(
          engine.list().map(
            (event) =>
              event.id,
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
          eventType:
            'system.first',
          message:
            'First event.',
        });

        expect(() =>
          engine.record({
            id: 'duplicate',
            eventType:
              'system.second',
            message:
              'Second event.',
          }),
        ).toThrow(
          'already exists',
        );
      },
    );

    it(
      'rejects empty required fields',
      () => {
        expect(() =>
          engine.record({
            eventType: ' ',
            message:
              'Message.',
          }),
        ).toThrow(
          'eventType is required',
        );

        expect(() =>
          engine.record({
            eventType:
              'system.event',
            message: ' ',
          }),
        ).toThrow(
          'message is required',
        );
      },
    );

    it(
      'calculates engine metrics',
      () => {
        engine.record({
          eventType:
            'runtime.started',
          category:
            'runtime',
          severity:
            'info',
          outcome:
            'success',
          correlationId:
            'correlation-one',
          message:
            'Runtime started.',
        });

        engine.record({
          eventType:
            'plugin.failed',
          category:
            'plugin',
          severity:
            'error',
          outcome:
            'failure',
          message:
            'Plugin failed.',
        });

        const metrics =
          engine.metrics();

        expect(
          metrics.totalEvents,
        ).toBe(2);

        expect(
          metrics.categories.runtime,
        ).toBe(1);

        expect(
          metrics.categories.plugin,
        ).toBe(1);

        expect(
          metrics.severities.error,
        ).toBe(1);

        expect(
          metrics.outcomes.success,
        ).toBe(1);

        expect(
          metrics.correlatedEvents,
        ).toBe(1);
      },
    );

    it(
      'clears all recorded events',
      () => {
        engine.record({
          eventType:
            'system.event',
          message:
            'System event.',
        });

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