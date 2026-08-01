import { IsBoolean, IsEnum, IsInt, IsObject, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { EventDeliveryStatus, EventMessagePriority, EventReplayStatus, EventSubscriptionStatus, EventTopicStatus } from '../../../../generated/prisma/enums';

export class CreateEventTopicDto {
  @IsString() @MaxLength(100) topicKey!: string;
  @IsString() @MaxLength(180) name!: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsOptional() @IsEnum(EventTopicStatus) status?: EventTopicStatus;
  @IsOptional() @IsInt() @Min(1) @Max(100) partitions?: number;
  @IsOptional() @IsInt() @Min(1) @Max(3650) retentionDays?: number;
  @IsOptional() @IsBoolean() ordered?: boolean;
  @IsOptional() @IsObject() schema?: Record<string, unknown>;
}

export class CreateEventSubscriptionDto {
  @IsString() topicId!: string;
  @IsString() @MaxLength(100) subscriptionKey!: string;
  @IsString() @MaxLength(180) name!: string;
  @IsString() @MaxLength(80) consumerType!: string;
  @IsOptional() @IsString() @MaxLength(500) endpoint?: string;
  @IsOptional() @IsEnum(EventSubscriptionStatus) status?: EventSubscriptionStatus;
  @IsOptional() @IsInt() @Min(1) @Max(100) maxAttempts?: number;
  @IsOptional() @IsInt() @Min(1) @Max(86400) retryDelaySeconds?: number;
  @IsOptional() @IsObject() filter?: Record<string, unknown>;
}

export class PublishEventMessageDto {
  @IsString() @MaxLength(160) eventName!: string;
  @IsString() @MaxLength(80) eventVersion!: string;
  @IsString() @MaxLength(120) producer!: string;
  @IsOptional() @IsString() aggregateType?: string;
  @IsOptional() @IsString() aggregateId?: string;
  @IsOptional() @IsString() correlationId?: string;
  @IsOptional() @IsString() causationId?: string;
  @IsOptional() @IsString() idempotencyKey?: string;
  @IsOptional() @IsEnum(EventMessagePriority) priority?: EventMessagePriority;
  @IsObject() payload!: Record<string, unknown>;
  @IsOptional() @IsObject() headers?: Record<string, unknown>;
}

export class TransitionEventDeliveryDto {
  @IsEnum(EventDeliveryStatus) status!: EventDeliveryStatus;
  @IsOptional() @IsString() @MaxLength(4000) response?: string;
  @IsOptional() @IsString() @MaxLength(2000) error?: string;
}

export class CreateEventReplayDto {
  @IsString() topicId!: string;
  @IsString() @MaxLength(120) replayKey!: string;
  @IsOptional() @IsString() subscriptionId?: string;
  @IsOptional() @IsString() fromMessageId?: string;
  @IsOptional() @IsString() toMessageId?: string;
  @IsOptional() @IsInt() @Min(1) @Max(10000) limit?: number;
}

export class TransitionEventReplayDto {
  @IsEnum(EventReplayStatus) status!: EventReplayStatus;
  @IsOptional() @IsString() @MaxLength(2000) error?: string;
}
