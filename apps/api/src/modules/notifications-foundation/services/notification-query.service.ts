import {
  Injectable,
} from '@nestjs/common';

import type {
  Notification,
  NotificationListResult,
  NotificationPriority,
  NotificationQuery,
  NotificationStatistics,
} from '../contracts';
import {
  NotificationEngineService,
} from './notification-engine.service';

@Injectable()
export class NotificationQueryService {
  constructor(
    private readonly engine:
      NotificationEngineService,
  ) {}

  search(
    query:
      NotificationQuery = {},
  ): NotificationListResult {
    const filtered =
      this.filter(
        this.engine.list(),
        query,
      );

    const sorted =
      this.sort(
        filtered,
        query.sortBy ??
          'createdAt',
        query.sortDirection ??
          'desc',
      );

    const page =
      this.normalizePage(
        query.page,
      );

    const pageSize =
      this.normalizePageSize(
        query.pageSize,
      );

    const totalItems =
      sorted.length;

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          totalItems /
          pageSize,
        ),
      );

    const safePage =
      Math.min(
        page,
        totalPages,
      );

    const offset =
      (safePage - 1) *
      pageSize;

    const notifications =
      sorted.slice(
        offset,
        offset + pageSize,
      );

    return {
      count:
        notifications.length,
      total:
        totalItems,
      pagination: {
        page:
          safePage,
        pageSize,
        totalItems,
        totalPages,
        hasPreviousPage:
          safePage > 1,
        hasNextPage:
          safePage <
          totalPages,
      },
      notifications:
        notifications.map(
          (notification) =>
            this.clone(
              notification,
            ),
        ),
    };
  }

  unreadForRecipient(
    recipientId: string,
  ): readonly Notification[] {
    return this.search({
      recipientId,
      unreadByRecipientId:
        recipientId,
      pageSize: 500,
    }).notifications;
  }

  readForRecipient(
    recipientId: string,
  ): readonly Notification[] {
    return this.search({
      recipientId,
      readByRecipientId:
        recipientId,
      pageSize: 500,
    }).notifications;
  }

  failedDeliveries():
    readonly Notification[] {
    return this.engine.list()
      .filter(
        (notification) =>
          notification.deliveries
            .some(
              (delivery) =>
                delivery.status ===
                'failed',
            ),
      )
      .map(
        (notification) =>
          this.clone(
            notification,
          ),
      );
  }

  pendingRetries():
    readonly Notification[] {
    return this.engine.list()
      .filter(
        (notification) =>
          notification.deliveries
            .some(
              (delivery) =>
                Boolean(
                  delivery.retry
                    .nextRetryAt,
                ),
            ),
      )
      .map(
        (notification) =>
          this.clone(
            notification,
          ),
      );
  }

  statistics(
    query:
      NotificationQuery = {},
  ): NotificationStatistics {
    const notifications =
      this.filter(
        this.engine.list(),
        query,
      );

    const deliveries =
      notifications.flatMap(
        (notification) =>
          notification.deliveries,
      );

    return {
      total:
        notifications.length,
      read:
        notifications.filter(
          (notification) =>
            notification.readBy
              .length > 0,
        ).length,
      unread:
        notifications.filter(
          (notification) =>
            notification.readBy
              .length === 0,
        ).length,
      statuses:
        this.countValues(
          notifications.map(
            (notification) =>
              notification.status,
          ),
        ),
      priorities:
        this.countValues(
          notifications.map(
            (notification) =>
              notification.priority,
          ),
        ),
      types:
        this.countValues(
          notifications.map(
            (notification) =>
              notification.type,
          ),
        ),
      channels:
        this.countValues(
          deliveries.map(
            (delivery) =>
              delivery.channel,
          ),
        ),
      deliveryStatuses:
        this.countValues(
          deliveries.map(
            (delivery) =>
              delivery.status,
          ),
        ),
      failedDeliveries:
        deliveries.filter(
          (delivery) =>
            delivery.status ===
            'failed',
        ).length,
      pendingRetries:
        deliveries.filter(
          (delivery) =>
            Boolean(
              delivery.retry
                .nextRetryAt,
            ),
        ).length,
      generatedAt:
        new Date().toISOString(),
    };
  }

  private filter(
    notifications:
      readonly Notification[],
    query:
      NotificationQuery,
  ): readonly Notification[] {
    const search =
      query.search
        ?.trim()
        .toLowerCase();

    const statuses =
      new Set(
        query.statuses ?? [],
      );

    const priorities =
      new Set(
        query.priorities ?? [],
      );

    const channels =
      new Set(
        query.channels ?? [],
      );

    const types =
      new Set(
        query.types ?? [],
      );

    const recipientId =
      query.recipientId
        ?.trim()
        .toLowerCase();

    const correlationId =
      query.correlationId
        ?.trim()
        .toLowerCase();

    const source =
      query.source
        ?.trim()
        .toLowerCase();

    return notifications.filter(
      (notification) => {
        if (
          statuses.size > 0 &&
          !statuses.has(
            notification.status,
          )
        ) {
          return false;
        }

        if (
          priorities.size > 0 &&
          !priorities.has(
            notification.priority,
          )
        ) {
          return false;
        }

        if (
          types.size > 0 &&
          !types.has(
            notification.type,
          )
        ) {
          return false;
        }

        if (
          channels.size > 0 &&
          !notification.channels
            .some(
              (channel) =>
                channels.has(
                  channel,
                ),
            )
        ) {
          return false;
        }

        if (
          recipientId &&
          !notification.recipients
            .some(
              (recipient) =>
                recipient.id
                  .toLowerCase() ===
                recipientId,
            )
        ) {
          return false;
        }

        if (
          query.recipientType &&
          !notification.recipients
            .some(
              (recipient) =>
                recipient.type ===
                query.recipientType,
            )
        ) {
          return false;
        }

        if (
          correlationId &&
          notification.correlationId
            ?.toLowerCase() !==
            correlationId
        ) {
          return false;
        }

        if (
          source &&
          notification.source
            ?.toLowerCase() !==
            source
        ) {
          return false;
        }

        if (
          query.readByRecipientId &&
          !notification.readBy
            .includes(
              query
                .readByRecipientId,
            )
        ) {
          return false;
        }

        if (
          query.unreadByRecipientId &&
          notification.readBy
            .includes(
              query
                .unreadByRecipientId,
            )
        ) {
          return false;
        }

        if (
          !this.inRange(
            notification.createdAt,
            query.createdFrom,
            query.createdTo,
          )
        ) {
          return false;
        }

        if (search) {
          const searchable =
            [
              notification.id,
              notification.title,
              notification.message,
              notification.type,
              notification.status,
              notification.priority,
              notification.source,
              notification
                .correlationId,
              notification.actionUrl,
              ...notification.tags,
              ...notification
                .recipients
                .flatMap(
                  (recipient) => [
                    recipient.id,
                    recipient.type,
                    recipient
                      .displayName,
                    recipient.address,
                  ],
                ),
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();

          if (
            !searchable.includes(
              search,
            )
          ) {
            return false;
          }
        }

        return true;
      },
    );
  }

  private sort(
    notifications:
      readonly Notification[],
    sortBy:
      NonNullable<
        NotificationQuery['sortBy']
      >,
    direction:
      'asc' | 'desc',
  ): readonly Notification[] {
    const multiplier =
      direction === 'asc'
        ? 1
        : -1;

    const priorityRank:
      Record<
        NotificationPriority,
        number
      > = {
        low: 1,
        normal: 2,
        high: 3,
        urgent: 4,
        critical: 5,
      };

    return [
      ...notifications,
    ].sort(
      (left, right) => {
        if (
          sortBy === 'priority'
        ) {
          return (
            priorityRank[
              left.priority
            ] -
            priorityRank[
              right.priority
            ]
          ) * multiplier;
        }

        return String(
          left[sortBy],
        ).localeCompare(
          String(
            right[sortBy],
          ),
        ) * multiplier;
      },
    );
  }

  private inRange(
    value: string,
    from?: string,
    to?: string,
  ): boolean {
    const timestamp =
      new Date(value).getTime();

    if (
      !Number.isFinite(
        timestamp,
      )
    ) {
      return false;
    }

    if (from) {
      const fromTimestamp =
        new Date(from).getTime();

      if (
        Number.isFinite(
          fromTimestamp,
        ) &&
        timestamp <
          fromTimestamp
      ) {
        return false;
      }
    }

    if (to) {
      const toTimestamp =
        new Date(to).getTime();

      if (
        Number.isFinite(
          toTimestamp,
        ) &&
        timestamp >
          toTimestamp
      ) {
        return false;
      }
    }

    return true;
  }

  private normalizePage(
    page?: number,
  ): number {
    return typeof page ===
        'number' &&
      Number.isFinite(page)
      ? Math.max(
          1,
          Math.floor(page),
        )
      : 1;
  }

  private normalizePageSize(
    pageSize?: number,
  ): number {
    return typeof pageSize ===
        'number' &&
      Number.isFinite(
        pageSize,
      )
      ? Math.max(
          1,
          Math.min(
            500,
            Math.floor(
              pageSize,
            ),
          ),
        )
      : 50;
  }

  private countValues(
    values:
      readonly string[],
  ):
    Readonly<Record<string, number>> {
    const result:
      Record<string, number> =
        {};

    for (const value of values) {
      result[value] =
        (result[value] ?? 0) +
        1;
    }

    return result;
  }

  private clone(
    notification:
      Notification,
  ): Notification {
    return {
      ...notification,
      recipients:
        notification.recipients
          .map(
            (recipient) => ({
              ...recipient,
            }),
          ),
      channels: [
        ...notification.channels,
      ],
      deliveries:
        notification.deliveries
          .map(
            (delivery) => ({
              ...delivery,
              retry: {
                ...delivery.retry,
              },
            }),
          ),
      readBy: [
        ...notification.readBy,
      ],
      metadata: {
        ...notification.metadata,
      },
      tags: [
        ...notification.tags,
      ],
    };
  }
}