import {
  IsArray,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

import {
  DELIVERY_STATUSES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_STATUSES,
  NOTIFICATION_TYPES,
  type DeliveryStatus,
  type NotificationChannel,
  type NotificationPriority,
  type NotificationRecipientType,
  type NotificationStatus,
  type NotificationType,
} from '../contracts';

export class CreateNotificationDto {
  @IsOptional()
  @IsIn(NOTIFICATION_TYPES)
  type?: NotificationType;

  @IsOptional()
  @IsIn(NOTIFICATION_PRIORITIES)
  priority?: NotificationPriority;

  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @MinLength(1)
  message!: string;

  @IsArray()
  @IsObject({
    each: true,
  })
  recipients!:
    readonly Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  @IsIn(
    NOTIFICATION_CHANNELS,
    {
      each: true,
    },
  )
  channels?: NotificationChannel[];

  @IsOptional()
  @IsString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  expiresAt?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  actionUrl?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  tags?: string[];
}

export class NotificationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsIn(
    NOTIFICATION_STATUSES,
    {
      each: true,
    },
  )
  statuses?: NotificationStatus[];

  @IsOptional()
  @IsArray()
  @IsIn(
    NOTIFICATION_PRIORITIES,
    {
      each: true,
    },
  )
  priorities?: NotificationPriority[];

  @IsOptional()
  @IsArray()
  @IsIn(
    NOTIFICATION_CHANNELS,
    {
      each: true,
    },
  )
  channels?: NotificationChannel[];

  @IsOptional()
  @IsArray()
  @IsIn(
    NOTIFICATION_TYPES,
    {
      each: true,
    },
  )
  types?: NotificationType[];

  @IsOptional()
  @IsString()
  recipientId?: string;

  @IsOptional()
  @IsIn([
    'user',
    'team',
    'role',
    'service',
    'agent',
    'system',
  ])
  recipientType?:
    NotificationRecipientType;

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  readByRecipientId?: string;

  @IsOptional()
  @IsString()
  unreadByRecipientId?: string;

  @IsOptional()
  @IsString()
  createdFrom?: string;

  @IsOptional()
  @IsString()
  createdTo?: string;

  @IsOptional()
  @IsIn([
    'createdAt',
    'updatedAt',
    'priority',
    'status',
    'title',
  ])
  sortBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'priority'
    | 'status'
    | 'title';

  @IsOptional()
  @IsIn([
    'asc',
    'desc',
  ])
  sortDirection?:
    | 'asc'
    | 'desc';

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  pageSize?: number;
}

export class NotificationRecipientActionDto {
  @IsString()
  @MinLength(1)
  recipientId!: string;
}

export class NotificationDeliveryStatusDto {
  @IsIn(NOTIFICATION_CHANNELS)
  channel!: NotificationChannel;

  @IsIn(DELIVERY_STATUSES)
  status!: DeliveryStatus;

  @IsOptional()
  @IsString()
  providerMessageId?: string;

  @IsOptional()
  @IsString()
  failureCode?: string;

  @IsOptional()
  @IsString()
  failureReason?: string;
}

export class NotificationRetryDto {
  @IsIn(NOTIFICATION_CHANNELS)
  channel!: NotificationChannel;

  @IsString()
  @MinLength(1)
  nextRetryAt!: string;
}

export class BulkNotificationActionDto {
  @IsArray()
  @IsString({
    each: true,
  })
  notificationIds!: string[];

  @IsOptional()
  @IsString()
  recipientId?: string;
}