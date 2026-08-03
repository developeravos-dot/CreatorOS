import type {
  LogActor,
  LogEntry,
  LogErrorDetails,
  LogLevel,
  LogResource,
  LogSource,
} from '../contracts';

export class LogEntryModel
  implements LogEntry {
  readonly id: string;
  readonly level: LogLevel;
  readonly source: LogSource;
  readonly context: string;
  readonly message: string;
  readonly timestamp: string;
  readonly recordedAt: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly traceId?: string;
  readonly spanId?: string;
  readonly actor?: LogActor;
  readonly resource?: LogResource;
  readonly error?: LogErrorDetails;
  readonly metadata:
    Readonly<Record<string, unknown>>;
  readonly tags:
    readonly string[];

  constructor(
    entry: LogEntry,
  ) {
    this.id =
      entry.id;

    this.level =
      entry.level;

    this.source =
      entry.source;

    this.context =
      entry.context;

    this.message =
      entry.message;

    this.timestamp =
      entry.timestamp;

    this.recordedAt =
      entry.recordedAt;

    this.correlationId =
      entry.correlationId;

    this.requestId =
      entry.requestId;

    this.traceId =
      entry.traceId;

    this.spanId =
      entry.spanId;

    this.actor =
      entry.actor
        ? {
            ...entry.actor,
          }
        : undefined;

    this.resource =
      entry.resource
        ? {
            ...entry.resource,
          }
        : undefined;

    this.error =
      entry.error
        ? {
            ...entry.error,
          }
        : undefined;

    this.metadata = {
      ...entry.metadata,
    };

    this.tags = [
      ...entry.tags,
    ];
  }

  toContract(): LogEntry {
    return {
      id:
        this.id,
      level:
        this.level,
      source:
        this.source,
      context:
        this.context,
      message:
        this.message,
      timestamp:
        this.timestamp,
      recordedAt:
        this.recordedAt,
      correlationId:
        this.correlationId,
      requestId:
        this.requestId,
      traceId:
        this.traceId,
      spanId:
        this.spanId,
      actor:
        this.actor
          ? {
              ...this.actor,
            }
          : undefined,
      resource:
        this.resource
          ? {
              ...this.resource,
            }
          : undefined,
      error:
        this.error
          ? {
              ...this.error,
            }
          : undefined,
      metadata: {
        ...this.metadata,
      },
      tags: [
        ...this.tags,
      ],
    };
  }
}