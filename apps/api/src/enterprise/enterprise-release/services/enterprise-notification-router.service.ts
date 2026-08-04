import {
  Injectable,
} from '@nestjs/common';

export interface EnterpriseNotification {
  readonly notificationId: string;
  readonly channel:
    | 'email'
    | 'webhook'
    | 'console';
  readonly recipient: string;
  readonly subject: string;
  readonly body: string;
  readonly status:
    | 'queued'
    | 'sent'
    | 'failed';
  readonly createdAt: Date;
}

@Injectable()
export class EnterpriseNotificationRouterService {
  private readonly notifications:
    EnterpriseNotification[] = [];

  queue(input: {
    readonly notificationId: string;
    readonly channel:
      EnterpriseNotification['channel'];
    readonly recipient: string;
    readonly subject: string;
    readonly body: string;
    readonly now?: Date;
  }): EnterpriseNotification {
    if (
      !input.notificationId.trim() ||
      !input.recipient.trim() ||
      !input.subject.trim() ||
      !input.body.trim() ||
      this.notifications.some(
        (item) =>
          item.notificationId ===
          input.notificationId,
      )
    ) {
      throw new Error(
        'Valid unique notification is required.',
      );
    }

    const notification:
      EnterpriseNotification = {
        notificationId:
          input.notificationId.trim(),
        channel:
          input.channel,
        recipient:
          input.recipient.trim(),
        subject:
          input.subject.trim(),
        body:
          input.body.trim(),
        status: 'queued',
        createdAt: new Date(
          input.now ?? new Date(),
        ),
      };

    this.notifications.push(
      notification,
    );

    return this.clone(
      notification,
    );
  }

  markSent(
    notificationId: string,
  ): EnterpriseNotification {
    return this.transition(
      notificationId,
      'sent',
    );
  }

  markFailed(
    notificationId: string,
  ): EnterpriseNotification {
    return this.transition(
      notificationId,
      'failed',
    );
  }

  list():
    readonly EnterpriseNotification[] {
    return this.notifications
      .map((item) =>
        this.clone(item),
      );
  }

  private transition(
    notificationId: string,
    status:
      EnterpriseNotification['status'],
  ): EnterpriseNotification {
    const index =
      this.notifications
        .findIndex(
          (item) =>
            item.notificationId ===
            notificationId.trim(),
        );

    if (index < 0) {
      throw new Error(
        'Notification was not found.',
      );
    }

    const updated = {
      ...this.notifications[index]!,
      status,
    };

    this.notifications[index] =
      updated;

    return this.clone(updated);
  }

  private clone(
    notification:
      EnterpriseNotification,
  ): EnterpriseNotification {
    return {
      ...notification,
      createdAt:
        new Date(
          notification.createdAt,
        ),
    };
  }
}
