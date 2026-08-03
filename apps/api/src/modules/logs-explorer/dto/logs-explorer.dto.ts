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
  LOG_LEVELS,
  LOG_SOURCES,
  type LogLevel,
  type LogSource,
} from '../contracts';

export class RecordLogEntryDto {
  @IsOptional()
  @IsIn(LOG_LEVELS)
  level?: LogLevel;

  @IsOptional()
  @IsIn(LOG_SOURCES)
  source?: LogSource;

  @IsOptional()
  @IsString()
  context?: string;

  @IsString()
  @MinLength(1)
  message!: string;

  @IsOptional()
  @IsString()
  timestamp?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsString()
  requestId?: string;

  @IsOptional()
  @IsString()
  traceId?: string;

  @IsOptional()
  @IsString()
  spanId?: string;

  @IsOptional()
  @IsObject()
  actor?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  resource?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  error?: Record<string, unknown>;

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

export class LogEntryListQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsIn(
    LOG_LEVELS,
    {
      each: true,
    },
  )
  levels?: LogLevel[];

  @IsOptional()
  @IsArray()
  @IsIn(
    LOG_SOURCES,
    {
      each: true,
    },
  )
  sources?: LogSource[];

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  contexts?: string[];

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsString()
  requestId?: string;

  @IsOptional()
  @IsString()
  traceId?: string;

  @IsOptional()
  @IsString()
  resourceId?: string;

  @IsOptional()
  @IsString()
  actorId?: string;

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

export class LogExportDto {
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