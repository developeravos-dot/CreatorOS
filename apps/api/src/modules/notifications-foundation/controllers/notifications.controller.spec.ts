import {
  NotFoundException,
} from '@nestjs/common';

import {
  NotificationsController,
} from './notifications.controller';

describe(
  'NotificationsController',
  () => {
    function setup() {
      const notification = {
        id: 'notification-one',
        title: 'Notification',
        message: 'Message',
      };

      const engine = {
        create:
          jest.fn(
            () => notification,
          ),
        getById:
          jest.fn<
            {
              id: string;
              title: string;
              message: string;
            } | undefined,
            [string]
          >(
            () => notification,
          ),
        markRead:
          jest.fn(
            () => notification,
          ),
        markUnread:
          jest.fn(
            () => notification,
          ),
        updateDeliveryStatus:
          jest.fn(
            () => notification,
          ),
        scheduleRetry:
          jest.fn(
            () => notification,
          ),
        cancel:
          jest.fn(
            () => notification,
          ),
        bulkMarkRead:
          jest.fn(
            () => ({
              successful: 1,
            }),
          ),
        bulkMarkUnread:
          jest.fn(
            () => ({
              successful: 1,
            }),
          ),
        bulkCancel:
          jest.fn(
            () => ({
              successful: 1,
            }),
          ),
        metrics:
          jest.fn(
            () => ({
              totalNotifications: 1,
            }),
          ),
      };

      const query = {
        search:
          jest.fn(
            () => ({
              total: 1,
            }),
          ),
        statistics:
          jest.fn(
            () => ({
              total: 1,
            }),
          ),
        failedDeliveries:
          jest.fn(
            () => [],
          ),
        pendingRetries:
          jest.fn(
            () => [],
          ),
        readForRecipient:
          jest.fn(
            () => [],
          ),
        unreadForRecipient:
          jest.fn(
            () => [],
          ),
      };

      const controller =
        new NotificationsController(
          engine as never,
          query as never,
        );

      return {
        controller,
        engine,
        query,
      };
    }

    it(
      'delegates listing search statistics and metrics',
      () => {
        const {
          controller,
          engine,
          query,
        } = setup();

        controller.list({});
        controller.search({});
        controller.statistics({});
        controller.metrics();

        expect(
          query.search,
        ).toHaveBeenCalledTimes(2);

        expect(
          query.statistics,
        ).toHaveBeenCalledTimes(1);

        expect(
          engine.metrics,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      'delegates delivery and retry queries',
      () => {
        const {
          controller,
          query,
        } = setup();

        controller.failedDeliveries();
        controller.pendingRetries();

        expect(
          query.failedDeliveries,
        ).toHaveBeenCalledTimes(1);

        expect(
          query.pendingRetries,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      'delegates recipient read and unread queries',
      () => {
        const {
          controller,
          query,
        } = setup();

        controller.readForRecipient(
          'user-one',
        );

        controller.unreadForRecipient(
          'user-one',
        );

        expect(
          query.readForRecipient,
        ).toHaveBeenCalledWith(
          'user-one',
        );

        expect(
          query.unreadForRecipient,
        ).toHaveBeenCalledWith(
          'user-one',
        );
      },
    );

    it(
      'creates notifications',
      () => {
        const {
          controller,
          engine,
        } = setup();

        controller.create({
          title: 'Notification',
          message: 'Message',
          recipients: [
            {
              id: 'user-one',
              type: 'user',
            },
          ],
        });

        expect(
          engine.create,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      'delegates lifecycle operations',
      () => {
        const {
          controller,
          engine,
        } = setup();

        controller.markRead(
          'notification-one',
          {
            recipientId:
              'user-one',
          },
        );

        controller.markUnread(
          'notification-one',
          {
            recipientId:
              'user-one',
          },
        );

        controller.updateDelivery(
          'notification-one',
          {
            channel:
              'email',
            status:
              'delivered',
          },
        );

        controller.scheduleRetry(
          'notification-one',
          {
            channel:
              'email',
            nextRetryAt:
              '2026-08-06T10:00:00.000Z',
          },
        );

        controller.cancel(
          'notification-one',
        );

        expect(
          engine.markRead,
        ).toHaveBeenCalledTimes(1);

        expect(
          engine.markUnread,
        ).toHaveBeenCalledTimes(1);

        expect(
          engine.updateDeliveryStatus,
        ).toHaveBeenCalledTimes(1);

        expect(
          engine.scheduleRetry,
        ).toHaveBeenCalledTimes(1);

        expect(
          engine.cancel,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      'delegates bulk operations',
      () => {
        const {
          controller,
          engine,
        } = setup();

        controller.bulkRead({
          notificationIds: [
            'notification-one',
          ],
          recipientId:
            'user-one',
        });

        controller.bulkUnread({
          notificationIds: [
            'notification-one',
          ],
          recipientId:
            'user-one',
        });

        controller.bulkCancel({
          notificationIds: [
            'notification-one',
          ],
        });

        expect(
          engine.bulkMarkRead,
        ).toHaveBeenCalledTimes(1);

        expect(
          engine.bulkMarkUnread,
        ).toHaveBeenCalledTimes(1);

        expect(
          engine.bulkCancel,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      'returns details and throws for missing notifications',
      () => {
        const {
          controller,
          engine,
        } = setup();

        expect(
          controller.details(
            'notification-one',
          ),
        ).toEqual(
          expect.objectContaining({
            id:
              'notification-one',
          }),
        );

        engine.getById
          .mockReturnValueOnce(
            undefined,
          );

        expect(() =>
          controller.details(
            'missing',
          ),
        ).toThrow(
          NotFoundException,
        );
      },
    );
  },
);