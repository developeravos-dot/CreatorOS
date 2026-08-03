import {
  NotificationEngineService,
} from './notification-engine.service';
import {
  NotificationQueryService,
} from './notification-query.service';

describe(
  'NotificationQueryService',
  () => {
    function setup() {
      const engine =
        new NotificationEngineService();

      engine.create({
        id: 'notification-1',
        type: 'monitoring',
        priority: 'high',
        title:
          'Runtime warning',
        message:
          'Runtime is degraded.',
        recipients: [
          {
            id: 'user-1',
            type: 'user',
          },
        ],
        channels: [
          'in_app',
          'email',
        ],
        source:
          'monitoring',
        correlationId:
          'correlation-a',
      });

      engine.create({
        id: 'notification-2',
        type: 'security',
        priority: 'critical',
        title:
          'Security alert',
        message:
          'Unauthorized request.',
        recipients: [
          {
            id: 'user-2',
            type: 'user',
          },
        ],
        channels: [
          'push',
        ],
        source:
          'security',
        correlationId:
          'correlation-b',
      });

      engine.create({
        id: 'notification-3',
        type: 'content',
        priority: 'normal',
        title:
          'Content ready',
        message:
          'Content generation completed.',
        recipients: [
          {
            id: 'user-1',
            type: 'user',
          },
        ],
        channels: [
          'in_app',
        ],
        source:
          'content',
      });

      return {
        engine,
        query:
          new NotificationQueryService(
            engine,
          ),
      };
    }

    it(
      'performs advanced search',
      () => {
        const { query } =
          setup();

        const result =
          query.search({
            search:
              'unauthorized',
          });

        expect(result.total).toBe(
          1,
        );

        expect(
          result.notifications[0]
            ?.id,
        ).toBe(
          'notification-2',
        );
      },
    );

    it(
      'filters by priority type channel recipient and source',
      () => {
        const { query } =
          setup();

        expect(
          query.search({
            priorities: [
              'high',
            ],
            types: [
              'monitoring',
            ],
            channels: [
              'email',
            ],
            recipientId:
              'user-1',
            source:
              'monitoring',
          }).total,
        ).toBe(1);
      },
    );

    it(
      'supports read and unread queries',
      () => {
        const {
          engine,
          query,
        } = setup();

        engine.markRead(
          'notification-1',
          'user-1',
        );

        expect(
          query.readForRecipient(
            'user-1',
          ),
        ).toHaveLength(1);

        expect(
          query.unreadForRecipient(
            'user-1',
          ),
        ).toHaveLength(1);
      },
    );

    it(
      'supports pagination and sorting',
      () => {
        const { query } =
          setup();

        const result =
          query.search({
            page: 2,
            pageSize: 1,
            sortBy:
              'priority',
            sortDirection:
              'desc',
          });

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
          result.notifications,
        ).toHaveLength(1);
      },
    );

    it(
      'returns failed deliveries and pending retries',
      () => {
        const {
          engine,
          query,
        } = setup();

        engine.updateDeliveryStatus(
          'notification-1',
          'email',
          'failed',
          {
            failureReason:
              'Provider failed.',
          },
        );

        expect(
          query.failedDeliveries(),
        ).toHaveLength(1);

        engine.scheduleRetry(
          'notification-1',
          'email',
          '2026-08-05T10:00:00.000Z',
        );

        expect(
          query.pendingRetries(),
        ).toHaveLength(1);
      },
    );

    it(
      'calculates notification statistics',
      () => {
        const {
          engine,
          query,
        } = setup();

        engine.markRead(
          'notification-1',
          'user-1',
        );

        engine.updateDeliveryStatus(
          'notification-2',
          'push',
          'failed',
          {
            failureReason:
              'Push failed.',
          },
        );

        const statistics =
          query.statistics();

        expect(
          statistics.total,
        ).toBe(3);

        expect(
          statistics.read,
        ).toBe(1);

        expect(
          statistics.unread,
        ).toBe(2);

        expect(
          statistics.priorities
            .critical,
        ).toBe(1);

        expect(
          statistics.failedDeliveries,
        ).toBe(1);
      },
    );

    it(
      'returns independent snapshots',
      () => {
        const { query } =
          setup();

        const first =
          query.search();

        const second =
          query.search();

        expect(first).not.toBe(
          second,
        );

        expect(
          first.notifications,
        ).not.toBe(
          second.notifications,
        );
      },
    );
  },
);