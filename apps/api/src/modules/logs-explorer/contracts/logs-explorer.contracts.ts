export const LOG_LEVELS = [
  'trace',
  'debug',
  'info',
  'warn',
  'error',
  'fatal',
] as const;

export type LogLevel =
  (typeof LOG_LEVELS)[number];

export const LOG_SOURCES = [
  'application',
  'system',
  'http',
  'database',
  'capability',
  'runtime',
  'dependency',
  'plugin',
  'monitoring',
  'audit',
  'integration',
  'security',
  'unknown',
] as const;

export type LogSource =
  (typeof LOG_SOURCES)[number];

export interface LogErrorDetails {
  readonly name?: string;
  readonly message?: string;
  readonly code?: string;
  readonly stack?: string;
}

export interface LogActor {
  readonly id?: string;
  readonly type?:
    | 'user'
    | 'service'
    | 'agent'
    | 'system'
    | 'unknown';
  readonly displayName?: string;
}

export interface LogResource {
  readonly id?: string;
  readonly type?: string;
  readonly name?: string;
}

export interface LogEntry {
  readonly id: string;
  readonly level:
    LogLevel;
  readonly source:
    LogSource;
  readonly context: string;
  readonly message: string;
  readonly timestamp: string;
  readonly recordedAt: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly traceId?: string;
  readonly spanId?: string;
  readonly actor?:
    LogActor;
  readonly resource?:
    LogResource;
  readonly error?:
    LogErrorDetails;
  readonly metadata:
    Readonly<Record<string, unknown>>;
  readonly tags:
    readonly string[];
}

export interface RecordLogEntryInput {
  readonly id?: string;
  readonly level?:
    LogLevel;
  readonly source?:
    LogSource;
  readonly context?: string;
  readonly message: string;
  readonly timestamp?:
    string | Date;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly traceId?: string;
  readonly spanId?: string;
  readonly actor?:
    LogActor;
  readonly resource?:
    LogResource;
  readonly error?:
    LogErrorDetails | Error;
  readonly metadata?:
    Readonly<Record<string, unknown>>;
  readonly tags?:
    readonly string[];
}

export interface LogEngineMetrics {
  readonly totalEntries: number;
  readonly levels:
    Readonly<Record<string, number>>;
  readonly sources:
    Readonly<Record<string, number>>;
  readonly contexts:
    Readonly<Record<string, number>>;
  readonly correlatedEntries: number;
  readonly errorEntries: number;
  readonly generatedAt: string;
}

export interface LogEntryListQuery {
  readonly search?: string;
  readonly levels?:
    readonly LogLevel[];
  readonly sources?:
    readonly LogSource[];
  readonly contexts?:
    readonly string[];
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly traceId?: string;
  readonly resourceId?: string;
  readonly actorId?: string;
  readonly from?: string;
  readonly to?: string;
  readonly sortDirection?:
    | 'asc'
    | 'desc';
  readonly page?: number;
  readonly pageSize?: number;
}

export interface LogEntryPagination {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
}

export interface LogEntryListResult {
  readonly count: number;
  readonly total: number;
  readonly pagination:
    LogEntryPagination;
  readonly entries:
    readonly LogEntry[];
}