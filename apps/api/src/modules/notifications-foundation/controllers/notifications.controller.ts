import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import type {
  NotificationQuery,
  NotificationRecipient,
} from '../contracts';
import {
  BulkNotificationActionDto,
  CreateNotificationDto,
  NotificationDeliveryStatusDto,
  NotificationQueryDto,
  NotificationRecipientActionDto,
  NotificationRetryDto,
} from '../dto';
import {
  NotificationEngineService,
  NotificationQueryService,
} from '../services';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly engine:
      NotificationEngineService,
    private readonly query:
      NotificationQueryService,
  ) {}

  @Get()
  list(
    @Query()
    query:
      NotificationQueryDto,
  ) {
    return this.query.search(
      query,
    );
  }

  @Get('search')
  search(
    @Query()
    query:
      NotificationQueryDto,
  ) {
    return this.query.search(
      query,
    );
  }

  @Get('statistics')
  statistics(
    @Query()
    query:
      NotificationQueryDto,
  ) {
    return this.query.statistics(
      query,
    );
  }

  @Get('metrics')
  metrics() {
    return this.engine.metrics();
  }

  @Get('failed-deliveries')
  failedDeliveries() {
    return this.query
      .failedDeliveries();
  }

  @Get('pending-retries')
  pendingRetries() {
    return this.query
      .pendingRetries();
  }

  @Get('recipients/:recipientId/read')
  readForRecipient(
    @Param('recipientId')
    recipientId: string,
  ) {
    return this.query
      .readForRecipient(
        recipientId,
      );
  }

  @Get('recipients/:recipientId/unread')
  unreadForRecipient(
    @Param('recipientId')
    recipientId: string,
  ) {
    return this.query
      .unreadForRecipient(
        recipientId,
      );
  }

  @Post()
  create(
    @Body()
    input:
      CreateNotificationDto,
  ) {
    return this.engine.create({
      type:
        input.type,
      priority:
        input.priority,
      title:
        input.title,
      message:
        input.message,
      recipients:
        input.recipients as unknown as
          readonly NotificationRecipient[],
      channels:
        input.channels,
      scheduledAt:
        input.scheduledAt,
      expiresAt:
        input.expiresAt,
      correlationId:
        input.correlationId,
      source:
        input.source,
      actionUrl:
        input.actionUrl,
      metadata:
        input.metadata,
      tags:
        input.tags,
    });
  }

  @Patch(':notificationId/read')
  markRead(
    @Param('notificationId')
    notificationId: string,

    @Body()
    input:
      NotificationRecipientActionDto,
  ) {
    return this.getOrNotFound(
      notificationId,
      () =>
        this.engine.markRead(
          notificationId,
          input.recipientId,
        ),
    );
  }

  @Patch(':notificationId/unread')
  markUnread(
    @Param('notificationId')
    notificationId: string,

    @Body()
    input:
      NotificationRecipientActionDto,
  ) {
    return this.getOrNotFound(
      notificationId,
      () =>
        this.engine.markUnread(
          notificationId,
          input.recipientId,
        ),
    );
  }

  @Patch(':notificationId/delivery')
  updateDelivery(
    @Param('notificationId')
    notificationId: string,

    @Body()
    input:
      NotificationDeliveryStatusDto,
  ) {
    return this.getOrNotFound(
      notificationId,
      () =>
        this.engine
          .updateDeliveryStatus(
            notificationId,
            input.channel,
            input.status,
            {
              providerMessageId:
                input.providerMessageId,
              failureCode:
                input.failureCode,
              failureReason:
                input.failureReason,
            },
          ),
    );
  }

  @Patch(':notificationId/retry')
  scheduleRetry(
    @Param('notificationId')
    notificationId: string,

    @Body()
    input:
      NotificationRetryDto,
  ) {
    return this.getOrNotFound(
      notificationId,
      () =>
        this.engine.scheduleRetry(
          notificationId,
          input.channel,
          input.nextRetryAt,
        ),
    );
  }

  @Patch(':notificationId/cancel')
  cancel(
    @Param('notificationId')
    notificationId: string,
  ) {
    return this.getOrNotFound(
      notificationId,
      () =>
        this.engine.cancel(
          notificationId,
        ),
    );
  }

  @Post('bulk/read')
  bulkRead(
    @Body()
    input:
      BulkNotificationActionDto,
  ) {
    if (!input.recipientId) {
      throw new Error(
        'recipientId is required for bulk read.',
      );
    }

    return this.engine
      .bulkMarkRead(
        input.notificationIds,
        input.recipientId,
      );
  }

  @Post('bulk/unread')
  bulkUnread(
    @Body()
    input:
      BulkNotificationActionDto,
  ) {
    if (!input.recipientId) {
      throw new Error(
        'recipientId is required for bulk unread.',
      );
    }

    return this.engine
      .bulkMarkUnread(
        input.notificationIds,
        input.recipientId,
      );
  }

  @Post('bulk/cancel')
  bulkCancel(
    @Body()
    input:
      BulkNotificationActionDto,
  ) {
    return this.engine.bulkCancel(
      input.notificationIds,
    );
  }

  @Get(':notificationId')
  details(
    @Param('notificationId')
    notificationId: string,
  ) {
    const notification =
      this.engine.getById(
        notificationId,
      );

    if (!notification) {
      throw new NotFoundException(
        `Notification ${notificationId} was not found.`,
      );
    }

    return notification;
  }

  private getOrNotFound<T>(
    notificationId: string,
    operation: () => T,
  ): T {
    if (
      !this.engine.getById(
        notificationId,
      )
    ) {
      throw new NotFoundException(
        `Notification ${notificationId} was not found.`,
      );
    }

    return operation();
  }
}