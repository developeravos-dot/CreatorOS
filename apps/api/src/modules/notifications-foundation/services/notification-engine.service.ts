import {
  Injectable,
} from '@nestjs/common';
import {
  randomUUID,
} from 'node:crypto';

import type {
  BulkNotificationResult,
  CreateNotificationInput,
  DeliveryStatus,
  Notification,
  NotificationChannel,
  NotificationDelivery,
  NotificationEngineMetrics,
  NotificationRecipient,
  NotificationStatus,
} from '../contracts';

@Injectable()
export class NotificationEngineService {
  private readonly notifications =
    new Map<string, Notification>();

  create(
    input:
      CreateNotificationInput,
  ): Notification {
    const id =
      this.normalizeText(
        input.id,
      ) ?? randomUUID();

    if (this.notifications.has(id)) {
      throw new Error(
        `Notification ${id} already exists.`,
      );
    }

    const title =
      this.requireText(
        input.title,
        'title',
      );

    const message =
      this.sanitizeText(
        this.requireText(
          input.message,
          'message',
        ),
      );

    const recipients =
      this.normalizeRecipients(
        input.recipients,
      );

    if (recipients.length === 0) {
      throw new Error(
        'Notification must have at least one recipient.',
      );
    }

    const channels =
      this.normalizeChannels(
        input.channels,
      );

    const now =
      new Date().toISOString();

    const notification:
      Notification = {
        id,
        type:
          input.type ??
          'system',
        priority:
          input.priority ??
          'normal',
        status:
          'queued',
        title,
        message,
        recipients,
        channels,
        deliveries:
          channels.map(
            (channel) =>
              this.createDelivery(
                channel,
              ),
          ),
        readBy: [],
        createdAt: now,
        updatedAt: now,
        scheduledAt:
          this.normalizeTimestamp(
            input.scheduledAt,
          ),
        expiresAt:
          this.normalizeTimestamp(
            input.expiresAt,
          ),
        correlationId:
          this.normalizeText(
            input.correlationId,
          ),
        source:
          this.normalizeText(
            input.source,
          ),
        actionUrl:
          this.normalizeText(
            input.actionUrl,
          ),
        metadata:
          this.sanitizeRecord(
            input.metadata ?? {},
          ),
        tags:
          this.normalizeTags(
            input.tags,
          ),
      };

    this.notifications.set(
      id,
      notification,
    );

    return this.clone(notification);
  }

  getById(
    notificationId: string,
  ): Notification | undefined {
    const notification =
      this.notifications.get(
        notificationId,
      );

    return notification
      ? this.clone(notification)
      : undefined;
  }

  list():
    readonly Notification[] {
    return [
      ...this.notifications
        .values(),
    ]
      .sort(
        (left, right) =>
          right.createdAt
            .localeCompare(
              left.createdAt,
            ),
      )
      .map(
        (notification) =>
          this.clone(notification),
      );
  }

  markRead(
    notificationId: string,
    recipientId: string,
  ): Notification {
    return this.updateNotification(
      notificationId,
      (notification) => {
        const normalizedRecipientId =
          this.requireText(
            recipientId,
            'recipientId',
          );

        this.ensureRecipient(
          notification,
          normalizedRecipientId,
        );

        return {
          ...notification,
          readBy: [
            ...new Set([
              ...notification.readBy,
              normalizedRecipientId,
            ]),
          ],
        };
      },
    );
  }

  markUnread(
    notificationId: string,
    recipientId: string,
  ): Notification {
    return this.updateNotification(
      notificationId,
      (notification) => ({
        ...notification,
        readBy:
          notification.readBy
            .filter(
              (id) =>
                id !== recipientId,
            ),
      }),
    );
  }

  updateDeliveryStatus(
    notificationId: string,
    channel:
      NotificationChannel,
    status:
      DeliveryStatus,
    details: {
      providerMessageId?: string;
      failureCode?: string;
      failureReason?: string;
    } = {},
  ): Notification {
    return this.updateNotification(
      notificationId,
      (notification) => {
        const now =
          new Date().toISOString();

        const deliveries =
          notification.deliveries
            .map(
              (delivery) => {
                if (
                  delivery.channel !==
                  channel
                ) {
                  return delivery;
                }

                const retry =
                  status === 'failed'
                    ? {
                        ...delivery.retry,
                        attemptCount:
                          delivery.retry
                            .attemptCount +
                          1,
                        lastAttemptAt:
                          now,
                        lastFailureReason:
                          this.sanitizeText(
                            details
                              .failureReason ??
                            'Delivery failed.',
                          ),
                      }
                    : {
                        ...delivery.retry,
                        lastAttemptAt:
                          now,
                      };

                return {
                  ...delivery,
                  status,
                  attemptedAt:
                    delivery.attemptedAt ??
                    now,
                  sentAt:
                    status === 'sent' ||
                    status === 'delivered'
                      ? (
                          delivery.sentAt ??
                          now
                        )
                      : delivery.sentAt,
                  deliveredAt:
                    status === 'delivered'
                      ? now
                      : delivery
                          .deliveredAt,
                  failedAt:
                    status === 'failed'
                      ? now
                      : undefined,
                  providerMessageId:
                    details
                      .providerMessageId ??
                    delivery
                      .providerMessageId,
                  failureCode:
                    status === 'failed'
                      ? details.failureCode
                      : undefined,
                  failureReason:
                    status === 'failed'
                      ? this.sanitizeText(
                          details
                            .failureReason ??
                          'Delivery failed.',
                        )
                      : undefined,
                  retry,
                };
              },
            );

        return {
          ...notification,
          deliveries,
          status:
            this.deriveStatus(
              deliveries,
            ),
        };
      },
    );
  }

  scheduleRetry(
    notificationId: string,
    channel:
      NotificationChannel,
    nextRetryAt: string | Date,
  ): Notification {
    const normalizedRetryAt =
      this.normalizeTimestamp(
        nextRetryAt,
      );

    if (!normalizedRetryAt) {
      throw new Error(
        'A valid nextRetryAt value is required.',
      );
    }

    return this.updateNotification(
      notificationId,
      (notification) => ({
        ...notification,
        deliveries:
          notification.deliveries
            .map(
              (delivery) =>
                delivery.channel ===
                channel
                  ? {
                      ...delivery,
                      status:
                        'pending',
                      retry: {
                        ...delivery.retry,
                        nextRetryAt:
                          normalizedRetryAt,
                      },
                    }
                  : delivery,
            ),
        status:
          'queued',
      }),
    );
  }

  cancel(
    notificationId: string,
  ): Notification {
    return this.updateNotification(
      notificationId,
      (notification) => ({
        ...notification,
        status:
          'cancelled',
        deliveries:
          notification.deliveries
            .map(
              (delivery) => ({
                ...delivery,
                status:
                  delivery.status ===
                  'delivered'
                    ? 'delivered'
                    : 'cancelled',
              }),
            ),
      }),
    );
  }

  bulkMarkRead(
    notificationIds:
      readonly string[],
    recipientId: string,
  ): BulkNotificationResult {
    return this.bulkExecute(
      notificationIds,
      (notificationId) => {
        this.markRead(
          notificationId,
          recipientId,
        );
      },
    );
  }

  bulkMarkUnread(
    notificationIds:
      readonly string[],
    recipientId: string,
  ): BulkNotificationResult {
    return this.bulkExecute(
      notificationIds,
      (notificationId) => {
        this.markUnread(
          notificationId,
          recipientId,
        );
      },
    );
  }

  bulkCancel(
    notificationIds:
      readonly string[],
  ): BulkNotificationResult {
    return this.bulkExecute(
      notificationIds,
      (notificationId) => {
        this.cancel(
          notificationId,
        );
      },
    );
  }

  metrics():
    NotificationEngineMetrics {
    const notifications =
      this.list();

    const deliveries =
      notifications.flatMap(
        (notification) =>
          notification.deliveries,
      );

    return {
      totalNotifications:
        notifications.length,
      totalRecipients:
        notifications.reduce(
          (
            total,
            notification,
          ) =>
            total +
            notification
              .recipients.length,
          0,
        ),
      totalDeliveries:
        deliveries.length,
      deliveredNotifications:
        notifications.filter(
          (notification) =>
            notification.status ===
              'delivered' ||
            notification.status ===
              'partially_delivered',
        ).length,
      failedNotifications:
        notifications.filter(
          (notification) =>
            notification.status ===
            'failed',
        ).length,
      unreadNotifications:
        notifications.filter(
          (notification) =>
            notification.readBy
              .length === 0,
        ).length,
      pendingRetries:
        deliveries.filter(
          (delivery) =>
            Boolean(
              delivery.retry
                .nextRetryAt,
            ),
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
      channels:
        this.countValues(
          deliveries.map(
            (delivery) =>
              delivery.channel,
          ),
        ),
      generatedAt:
        new Date().toISOString(),
    };
  }

  clear(): void {
    this.notifications.clear();
  }

  private updateNotification(
    notificationId: string,
    updater:
      (
        notification:
          Notification,
      ) => Notification,
  ): Notification {
    const existing =
      this.notifications.get(
        notificationId,
      );

    if (!existing) {
      throw new Error(
        `Notification ${notificationId} was not found.`,
      );
    }

    const updated =
      updater(
        this.clone(existing),
      );

    const finalNotification = {
      ...updated,
      updatedAt:
        new Date().toISOString(),
    };

    this.notifications.set(
      notificationId,
      finalNotification,
    );

    return this.clone(
      finalNotification,
    );
  }

  private bulkExecute(
    notificationIds:
      readonly string[],
    operation:
      (
        notificationId: string,
      ) => void,
  ): BulkNotificationResult {
    const uniqueIds = [
      ...new Set(
        notificationIds
          .map(
            (id) =>
              id.trim(),
          )
          .filter(Boolean),
      ),
    ];

    const successfulIds:
      string[] = [];

    const failures:
      {
        notificationId: string;
        reason: string;
      }[] = [];

    for (
      const notificationId
      of uniqueIds
    ) {
      try {
        operation(
          notificationId,
        );

        successfulIds.push(
          notificationId,
        );
      } catch (error) {
        failures.push({
          notificationId,
          reason:
            error instanceof Error
              ? error.message
              : String(error),
        });
      }
    }

    return {
      requested:
        uniqueIds.length,
      successful:
        successfulIds.length,
      failed:
        failures.length,
      notificationIds:
        successfulIds,
      failures,
    };
  }

  private createDelivery(
    channel:
      NotificationChannel,
  ): NotificationDelivery {
    return {
      channel,
      status:
        'pending',
      retry: {
        attemptCount: 0,
        maximumAttempts: 3,
      },
    };
  }

  private deriveStatus(
    deliveries:
      readonly NotificationDelivery[],
  ): NotificationStatus {
    if (
      deliveries.length > 0 &&
      deliveries.every(
        (delivery) =>
          delivery.status ===
          'delivered',
      )
    ) {
      return 'delivered';
    }

    if (
      deliveries.some(
        (delivery) =>
          delivery.status ===
          'delivered',
      )
    ) {
      return 'partially_delivered';
    }

    if (
      deliveries.length > 0 &&
      deliveries.every(
        (delivery) =>
          delivery.status ===
          'failed',
      )
    ) {
      return 'failed';
    }

    if (
      deliveries.some(
        (delivery) =>
          delivery.status ===
          'sent',
      )
    ) {
      return 'sent';
    }

    if (
      deliveries.some(
        (delivery) =>
          delivery.status ===
          'processing',
      )
    ) {
      return 'processing';
    }

    return 'queued';
  }

  private ensureRecipient(
    notification:
      Notification,
    recipientId: string,
  ): void {
    if (
      !notification.recipients
        .some(
          (recipient) =>
            recipient.id ===
            recipientId,
        )
    ) {
      throw new Error(
        `Recipient ${recipientId} is not assigned to notification ${notification.id}.`,
      );
    }
  }

  private normalizeRecipients(
    recipients:
      readonly NotificationRecipient[],
  ):
    readonly NotificationRecipient[] {
    const byKey =
      new Map<
        string,
        NotificationRecipient
      >();

    for (
      const recipient
      of recipients
    ) {
      const id =
        this.requireText(
          recipient.id,
          'recipient.id',
        );

      const key =
        `${recipient.type}:${id}`;

      byKey.set(key, {
        id,
        type:
          recipient.type,
        displayName:
          this.normalizeText(
            recipient.displayName,
          ),
        address:
          recipient.address
            ? this.sanitizeText(
                recipient.address,
              )
            : undefined,
      });
    }

    return [
      ...byKey.values(),
    ];
  }

  private normalizeChannels(
    channels?:
      readonly NotificationChannel[],
  ):
    readonly NotificationChannel[] {
    const defaults:
      readonly NotificationChannel[] = [
        'in_app',
      ];

    const source:
      readonly NotificationChannel[] =
        channels &&
        channels.length > 0
          ? channels
          : defaults;

    const normalized:
      NotificationChannel[] = [
        ...new Set<
          NotificationChannel
        >(source),
      ];

    return normalized;
  }

  private requireText(
    value: string,
    fieldName: string,
  ): string {
    const normalized =
      value?.trim();

    if (!normalized) {
      throw new Error(
        `Notification ${fieldName} is required.`,
      );
    }

    return normalized;
  }

  private normalizeText(
    value?: string,
  ): string | undefined {
    const normalized =
      value?.trim();

    return normalized ||
      undefined;
  }

  private normalizeTimestamp(
    value?:
      string | Date,
  ): string | undefined {
    if (value === undefined) {
      return undefined;
    }

    const date =
      value instanceof Date
        ? value
        : new Date(value);

    return Number.isFinite(
      date.getTime(),
    )
      ? date.toISOString()
      : undefined;
  }

  private normalizeTags(
    tags?:
      readonly string[],
  ):
    readonly string[] {
    return [
      ...new Set(
        (tags ?? [])
          .map(
            (tag) =>
              tag
                .trim()
                .toLowerCase(),
          )
          .filter(Boolean),
      ),
    ].sort();
  }

  private sanitizeText(
    value: string,
  ): string {
    return value
      .replace(
        /(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis):\/\/[^\s"']+/gi,
        '[REDACTED_CONNECTION_STRING]',
      )
      .replace(
        /Bearer\s+[A-Za-z0-9._~+/-]+=*/gi,
        'Bearer [REDACTED]',
      )
      .replace(
        /(DATABASE_URL|API_KEY|TOKEN|SECRET|PASSWORD)\s*[:=]\s*[^\s,;]+/gi,
        '$1=[REDACTED]',
      );
  }

  private sanitizeRecord(
    value:
      Readonly<Record<string, unknown>>,
  ):
    Readonly<Record<string, unknown>> {
    const sensitive =
      /password|secret|token|api[-_]?key|authorization|database[-_]?url/i;

    const output:
      Record<string, unknown> =
        {};

    for (
      const [key, item]
      of Object.entries(value)
    ) {
      if (sensitive.test(key)) {
        output[key] =
          '[REDACTED]';

        continue;
      }

      if (
        typeof item ===
        'string'
      ) {
        output[key] =
          this.sanitizeText(item);
      } else {
        output[key] =
          item;
      }
    }

    return output;
  }

  private countValues(
    values:
      readonly string[],
  ):
    Readonly<Record<string, number>> {
    const counts:
      Record<string, number> =
        {};

    for (const value of values) {
      counts[value] =
        (counts[value] ?? 0) +
        1;
    }

    return counts;
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