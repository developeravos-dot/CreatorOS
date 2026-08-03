import type {
  LogEntry,
  LogEntryListQuery,
  LogLevel,
  LogSource,
} from './logs-explorer.contracts';

export interface LogCorrelationGroup {
  readonly correlationId: string;
  readonly entryCount: number;
  readonly firstTimestamp: string;
  readonly lastTimestamp: string;
  readonly levels:
    Readonly<Record<string, number>>;
  readonly sources:
    readonly LogSource[];
  readonly contexts:
    readonly string[];
  readonly entries:
    readonly LogEntry[];
}

export interface LogTraceGroup {
  readonly traceId: string;
  readonly entryCount: number;
  readonly firstTimestamp: string;
  readonly lastTimestamp: string;
  readonly spanIds:
    readonly string[];
  readonly correlationIds:
    readonly string[];
  readonly entries:
    readonly LogEntry[];
}

export interface LogSearchStatistics {
  readonly totalMatched: number;
  readonly levels:
    Readonly<Record<string, number>>;
  readonly sources:
    Readonly<Record<string, number>>;
  readonly contexts:
    Readonly<Record<string, number>>;
  readonly correlations: number;
  readonly traces: number;
  readonly errors: number;
  readonly generatedAt: string;
}

export interface LogErrorSummaryItem {
  readonly id: string;
  readonly timestamp: string;
  readonly level:
    Extract<
      LogLevel,
      'error' | 'fatal'
    >;
  readonly source:
    LogSource;
  readonly context: string;
  readonly message: string;
  readonly errorName?: string;
  readonly errorCode?: string;
  readonly correlationId?: string;
  readonly traceId?: string;
  readonly resourceId?: string;
}

export interface LogErrorSummary {
  readonly count: number;
  readonly total: number;
  readonly entries:
    readonly LogErrorSummaryItem[];
  readonly levels:
    Readonly<Record<string, number>>;
  readonly sources:
    Readonly<Record<string, number>>;
  readonly contexts:
    Readonly<Record<string, number>>;
  readonly generatedAt: string;
}

export interface LogExportRequest {
  readonly format:
    | 'json'
    | 'csv';
  readonly query?:
    LogEntryListQuery;
}

export interface LogExportResult {
  readonly format:
    | 'json'
    | 'csv';
  readonly contentType: string;
  readonly filename: string;
  readonly entryCount: number;
  readonly content: string;
  readonly generatedAt: string;
}