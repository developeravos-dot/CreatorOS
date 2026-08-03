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
  AUDIT_EVENT_CATEGORIES,
  AUDIT_EVENT_OUTCOMES,
  AUDIT_EVENT_SEVERITIES,
  type AuditEventCategory,
  type AuditEventOutcome,
  type AuditEventSeverity,
} from '../contracts';

export class RecordAuditEventDto {
  @IsString()
  @MinLength(1)
  eventType!: string;

  @IsOptional()
  @IsIn(AUDIT_EVENT_CATEGORIES)
  category?:
    AuditEventCategory;

  @IsOptional()
  @IsIn(AUDIT_EVENT_SEVERITIES)
  severity?:
    AuditEventSeverity;

  @IsOptional()
  @IsIn(AUDIT_EVENT_OUTCOMES)
  outcome?:
    AuditEventOutcome;

  @IsString()
  @MinLength(1)
  message!: string;

  @IsOptional()
  @IsString()
  occurredAt?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsString()
  causationId?: string;

  @IsOptional()
  @IsObject()
  actor?:
    Record<string, unknown>;

  @IsOptional()
  @IsObject()
  resource?:
    Record<string, unknown>;

  @IsOptional()
  @IsArray()
  changes?:
    readonly Record<string, unknown>[];

  @IsOptional()
  @IsObject()
  metadata?:
    Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  tags?:
    string[];
}

export class AuditEventListQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsIn(
    AUDIT_EVENT_CATEGORIES,
    {
      each: true,
    },
  )
  categories?:
    AuditEventCategory[];

  @IsOptional()
  @IsArray()
  @IsIn(
    AUDIT_EVENT_SEVERITIES,
    {
      each: true,
    },
  )
  severities?:
    AuditEventSeverity[];

  @IsOptional()
  @IsArray()
  @IsIn(
    AUDIT_EVENT_OUTCOMES,
    {
      each: true,
    },
  )
  outcomes?:
    AuditEventOutcome[];

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsString()
  resourceId?: string;

  @IsOptional()
  @IsString()
  resourceType?: string;

  @IsOptional()
  @IsString()
  eventType?: string;

  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

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

export class AuditEventExportDto {
  @IsIn([
    'json',
    'csv',
  ])
  format!:
    | 'json'
    | 'csv';

  @IsOptional()
  @IsObject()
  query?:
    Record<string, unknown>;
}