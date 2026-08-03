import {
  NotificationEngineService,
} from './notification-engine.service';

describe(
  'NotificationEngineService',
  () => {
    let engine:
      NotificationEngineService;

    beforeEach(() => {
      engine =
        new NotificationEngineService();
    });

    function createSample(
      id = 'notification-one',
    ) {
      return engine.create({
        id,
        type:
          'monitoring',
        priority:
          'high',
        title:
          'System warning',
        message:
          'A system warning occurred.',
        recipients: [
          {
            id: 'user-one',
            type: 'user',
          },
        ],
        channels: [
          'in_app',
          'email',
        ],
        correlationId:
          'correlation-one',
      });
    }

    it(
      'creates notifications and delivery records',
      () => {
        const result =
          createSample();

        expect(result.status).toBe(
          'queued',
        );

        expect(
          result.recipients,
        ).toHaveLength(1);

        expect(
          result.deliveries,
        ).toHaveLength(2);

        expect(
          result.deliveries
            .every(
              (delivery) =>
                delivery.status ===
                'pending',
            ),
        ).toBe(true);
      },
    );

    it(
      'tracks read and unread state',
      () => {
        createSample();

        const read =
          engine.markRead(
            'notification-one',
            'user-one',
          );

        expect(read.readBy).toEqual([
          'user-one',
        ]);

        const unread =
          engine.markUnread(
            'notification-one',
            'user-one',
          );

        expect(unread.readBy).toEqual(
          [],
        );
      },
    );

    it(
      'updates delivery status',
      () => {
        createSample();

        engine.updateDeliveryStatus(
          'notification-one',
          'in_app',
          'delivered',
        );

        const partial =
          engine.getById(
            'notification-one',
          );

        expect(
          partial?.status,
        ).toBe(
          'partially_delivered',
        );

        engine.updateDeliveryStatus(
          'notification-one',
          'email',
          'delivered',
        );

        expect(
          engine.getById(
            'notification-one',
          )?.status,
        ).toBe('delivered');
      },
    );

    it(
      'records failures and retry metadata',
      () => {
        createSample();

        const failed =
          engine.updateDeliveryStatus(
            'notification-one',
            'email',
            'failed',
            {
              failureCode:
                'SMTP_ERROR',
              failureReason:
                'Email provider failed.',
            },
          );

        const delivery =
          failed.deliveries.find(
            (item) =>
              item.channel ===
              'email',
          );

        expect(
          delivery?.status,
        ).toBe('failed');

        expect(
          delivery?.retry
            .attemptCount,
        ).toBe(1);

        const retry =
          engine.scheduleRetry(
            'notification-one',
            'email',
            '2026-08-05T10:00:00.000Z',
          );

        expect(
          retry.deliveries.find(
            (item) =>
              item.channel ===
              'email',
          )?.retry.nextRetryAt,
        ).toBe(
          '2026-08-05T10:00:00.000Z',
        );
      },
    );

    it(
      'supports bulk operations with partial failures',
      () => {
        createSample(
          'notification-one',
        );

        createSample(
          'notification-two',
        );

        const result =
          engine.bulkMarkRead(
            [
              'notification-one',
              'notification-two',
              'missing',
            ],
            'user-one',
          );

        expect(result.requested).toBe(
          3,
        );

        expect(result.successful).toBe(
          2,
        );

        expect(result.failed).toBe(
          1,
        );
      },
    );

    it(
      'calculates metrics',
      () => {
        createSample();

        engine.updateDeliveryStatus(
          'notification-one',
          'email',
          'failed',
          {
            failureReason:
              'Failure.',
          },
        );

        engine.scheduleRetry(
          'notification-one',
          'email',
          '2026-08-05T10:00:00.000Z',
        );

        const metrics =
          engine.metrics();

        expect(
          metrics.totalNotifications,
        ).toBe(1);

        expect(
          metrics.totalRecipients,
        ).toBe(1);

        expect(
          metrics.totalDeliveries,
        ).toBe(2);

        expect(
          metrics.pendingRetries,
        ).toBe(1);
      },
    );

    it(
      'sanitizes secret values',
      () => {
        const notification =
          engine.create({
            title:
              'Secret test',
            message:
              'TOKEN=secret-token',
            recipients: [
              {
                id: 'user-one',
                type: 'user',
              },
            ],
            metadata: {
              password:
                'secret-password',
            },
          });

        const serialized =
          JSON.stringify(
            notification,
          );

        expect(serialized).not
          .toContain(
            'secret-token',
          );

        expect(serialized).not
          .toContain(
            'secret-password',
          );
      },
    );
  },
);