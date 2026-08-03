export const NOTIFICATION_STATUSES = [
  'draft',
  'queued',
  'processing',
  'sent',
  'delivered',
  'partially_delivered',
  'failed',
  'cancelled',
] as const;

export type NotificationStatus =
  (typeof NOTIFICATION_STATUSES)[number];

export const NOTIFICATION_PRIORITIES = [
  'low',
  'normal',
  'high',
  'urgent',
  'critical',
] as const;

export type NotificationPriority =
  (typeof NOTIFICATION_PRIORITIES)[number];

export const NOTIFICATION_CHANNELS = [
  'in_app',
  'email',
  'push',
  'sms',
  'webhook',
] as const;

export type NotificationChannel =
  (typeof NOTIFICATION_CHANNELS)[number];

export const NOTIFICATION_TYPES = [
  'system',
  'security',
  'monitoring',
  'audit',
  'capability',
  'runtime',
  'plugin',
  'workflow',
  'content',
  'billing',
  'user',
  'custom',
] as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[number];

export const DELIVERY_STATUSES = [
  'pending',
  'processing',
  'sent',
  'delivered',
  'failed',
  'cancelled',
] as const;

export type DeliveryStatus =
  (typeof DELIVERY_STATUSES)[number];

export type NotificationRecipientType =
  | 'user'
  | 'team'
  | 'role'
  | 'service'
  | 'agent'
  | 'system';

export interface NotificationRecipient {
  readonly id: string;
  readonly type:
    NotificationRecipientType;
  readonly displayName?: string;
  readonly address?: string;
}

export interface NotificationRetryMetadata {
  readonly attemptCount: number;
  readonly maximumAttempts: number;
  readonly nextRetryAt?: string;
  readonly lastAttemptAt?: string;
  readonly lastFailureReason?: string;
}

export interface NotificationDelivery {
  readonly channel:
    NotificationChannel;
  readonly status:
    DeliveryStatus;
  readonly attemptedAt?: string;
  readonly sentAt?: string;
  readonly deliveredAt?: string;
  readonly failedAt?: string;
  readonly providerMessageId?: string;
  readonly failureCode?: string;
  readonly failureReason?: string;
  readonly retry:
    NotificationRetryMetadata;
}

export interface Notification {
  readonly id: string;
  readonly type:
    NotificationType;
  readonly priority:
    NotificationPriority;
  readonly status:
    NotificationStatus;
  readonly title: string;
  readonly message: string;
  readonly recipients:
    readonly NotificationRecipient[];
  readonly channels:
    readonly NotificationChannel[];
  readonly deliveries:
    readonly NotificationDelivery[];
  readonly readBy:
    readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly scheduledAt?: string;
  readonly expiresAt?: string;
  readonly correlationId?: string;
  readonly source?: string;
  readonly actionUrl?: string;
  readonly metadata:
    Readonly<Record<string, unknown>>;
  readonly tags:
    readonly string[];
}

export interface CreateNotificationInput {
  readonly id?: string;
  readonly type?:
    NotificationType;
  readonly priority?:
    NotificationPriority;
  readonly title: string;
  readonly message: string;
  readonly recipients:
    readonly NotificationRecipient[];
  readonly channels?:
    readonly NotificationChannel[];
  readonly scheduledAt?: string | Date;
  readonly expiresAt?: string | Date;
  readonly correlationId?: string;
  readonly source?: string;
  readonly actionUrl?: string;
  readonly metadata?:
    Readonly<Record<string, unknown>>;
  readonly tags?:
    readonly string[];
}

export interface NotificationQuery {
  readonly search?: string;
  readonly statuses?:
    readonly NotificationStatus[];
  readonly priorities?:
    readonly NotificationPriority[];
  readonly channels?:
    readonly NotificationChannel[];
  readonly types?:
    readonly NotificationType[];
  readonly recipientId?: string;
  readonly recipientType?:
    NotificationRecipientType;
  readonly correlationId?: string;
  readonly source?: string;
  readonly readByRecipientId?: string;
  readonly unreadByRecipientId?: string;
  readonly createdFrom?: string;
  readonly createdTo?: string;
  readonly sortBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'priority'
    | 'status'
    | 'title';
  readonly sortDirection?:
    | 'asc'
    | 'desc';
  readonly page?: number;
  readonly pageSize?: number;
}

export interface NotificationPagination {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
}

export interface NotificationListResult {
  readonly count: number;
  readonly total: number;
  readonly pagination:
    NotificationPagination;
  readonly notifications:
    readonly Notification[];
}

export interface NotificationStatistics {
  readonly total: number;
  readonly read: number;
  readonly unread: number;
  readonly statuses:
    Readonly<Record<string, number>>;
  readonly priorities:
    Readonly<Record<string, number>>;
  readonly types:
    Readonly<Record<string, number>>;
  readonly channels:
    Readonly<Record<string, number>>;
  readonly deliveryStatuses:
    Readonly<Record<string, number>>;
  readonly failedDeliveries: number;
  readonly pendingRetries: number;
  readonly generatedAt: string;
}

export interface NotificationEngineMetrics {
  readonly totalNotifications: number;
  readonly totalRecipients: number;
  readonly totalDeliveries: number;
  readonly deliveredNotifications: number;
  readonly failedNotifications: number;
  readonly unreadNotifications: number;
  readonly pendingRetries: number;
  readonly statuses:
    Readonly<Record<string, number>>;
  readonly priorities:
    Readonly<Record<string, number>>;
  readonly channels:
    Readonly<Record<string, number>>;
  readonly generatedAt: string;
}

export interface BulkNotificationResult {
  readonly requested: number;
  readonly successful: number;
  readonly failed: number;
  readonly notificationIds:
    readonly string[];
  readonly failures:
    readonly {
      notificationId: string;
      reason: string;
    }[];
}