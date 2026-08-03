import {
  Injectable,
} from '@nestjs/common';
import {
  randomUUID,
} from 'node:crypto';

import type {
  LogActor,
  LogEngineMetrics,
  LogEntry,
  LogErrorDetails,
  LogResource,
  RecordLogEntryInput,
} from '../contracts';
import {
  LogEntryModel,
} from '../models';
import {
  normalizeLogTimestamp,
  sanitizeLogMessage,
  sanitizeLogRecord,
} from '../utils';

@Injectable()
export class LogsExplorerEngineService {
  private readonly entries =
    new Map<string, LogEntryModel>();

  record(
    input:
      RecordLogEntryInput,
  ): LogEntry {
    const id =
      this.normalizeIdentifier(
        input.id,
      ) ?? randomUUID();

    if (this.entries.has(id)) {
      throw new Error(
        `Log entry ${id} already exists.`,
      );
    }

    const now =
      new Date();

    const entry =
      new LogEntryModel({
        id,
        level:
          input.level ??
          'info',
        source:
          input.source ??
          'application',
        context:
          this.normalizeContext(
            input.context,
          ),
        message:
          sanitizeLogMessage(
            this.requiredMessage(
              input.message,
            ),
          ),
        timestamp:
          normalizeLogTimestamp(
            input.timestamp,
            now,
          ),
        recordedAt:
          now.toISOString(),
        correlationId:
          this.normalizeIdentifier(
            input.correlationId,
          ),
        requestId:
          this.normalizeIdentifier(
            input.requestId,
          ),
        traceId:
          this.normalizeIdentifier(
            input.traceId,
          ),
        spanId:
          this.normalizeIdentifier(
            input.spanId,
          ),
        actor:
          this.normalizeActor(
            input.actor,
          ),
        resource:
          this.normalizeResource(
            input.resource,
          ),
        error:
          this.normalizeError(
            input.error,
          ),
        metadata:
          sanitizeLogRecord(
            input.metadata ?? {},
          ),
        tags:
          this.normalizeTags(
            input.tags,
          ),
      });

    this.entries.set(
      entry.id,
      entry,
    );

    return entry.toContract();
  }

  trace(
    message: string,
    context?: string,
    metadata?:
      Readonly<Record<string, unknown>>,
  ): LogEntry {
    return this.record({
      level: 'trace',
      message,
      context,
      metadata,
    });
  }

  debug(
    message: string,
    context?: string,
    metadata?:
      Readonly<Record<string, unknown>>,
  ): LogEntry {
    return this.record({
      level: 'debug',
      message,
      context,
      metadata,
    });
  }

  info(
    message: string,
    context?: string,
    metadata?:
      Readonly<Record<string, unknown>>,
  ): LogEntry {
    return this.record({
      level: 'info',
      message,
      context,
      metadata,
    });
  }

  warn(
    message: string,
    context?: string,
    metadata?:
      Readonly<Record<string, unknown>>,
  ): LogEntry {
    return this.record({
      level: 'warn',
      message,
      context,
      metadata,
    });
  }

  error(
    message: string,
    error?: Error,
    context?: string,
    metadata?:
      Readonly<Record<string, unknown>>,
  ): LogEntry {
    return this.record({
      level: 'error',
      message,
      error,
      context,
      metadata,
    });
  }

  fatal(
    message: string,
    error?: Error,
    context?: string,
    metadata?:
      Readonly<Record<string, unknown>>,
  ): LogEntry {
    return this.record({
      level: 'fatal',
      message,
      error,
      context,
      metadata,
    });
  }

  getById(
    entryId: string,
  ): LogEntry | undefined {
    return this.entries
      .get(entryId)
      ?.toContract();
  }

  list():
    readonly LogEntry[] {
    return [
      ...this.entries.values(),
    ]
      .sort(
        (left, right) =>
          right.timestamp
            .localeCompare(
              left.timestamp,
            ),
      )
      .map(
        (entry) =>
          entry.toContract(),
      );
  }

  count(): number {
    return this.entries.size;
  }

  metrics():
    LogEngineMetrics {
    const entries =
      this.list();

    return {
      totalEntries:
        entries.length,
      levels:
        this.countValues(
          entries.map(
            (entry) =>
              entry.level,
          ),
        ),
      sources:
        this.countValues(
          entries.map(
            (entry) =>
              entry.source,
          ),
        ),
      contexts:
        this.countValues(
          entries.map(
            (entry) =>
              entry.context,
          ),
        ),
      correlatedEntries:
        entries.filter(
          (entry) =>
            Boolean(
              entry.correlationId,
            ),
        ).length,
      errorEntries:
        entries.filter(
          (entry) =>
            entry.level ===
              'error' ||
            entry.level ===
              'fatal',
        ).length,
      generatedAt:
        new Date().toISOString(),
    };
  }

  clear(): void {
    this.entries.clear();
  }

  private requiredMessage(
    message: string,
  ): string {
    const normalized =
      message?.trim();

    if (!normalized) {
      throw new Error(
        'Log entry message is required.',
      );
    }

    return normalized;
  }

  private normalizeContext(
    context?: string,
  ): string {
    return context?.trim() ||
      'Application';
  }

  private normalizeIdentifier(
    value?: string,
  ): string | undefined {
    const normalized =
      value?.trim();

    return normalized ||
      undefined;
  }

  private normalizeActor(
    actor?: LogActor,
  ): LogActor | undefined {
    if (!actor) {
      return undefined;
    }

    return {
      id:
        this.normalizeIdentifier(
          actor.id,
        ),
      type:
        actor.type ??
        'unknown',
      displayName:
        actor.displayName
          ?.trim() ||
        undefined,
    };
  }

  private normalizeResource(
    resource?: LogResource,
  ): LogResource | undefined {
    if (!resource) {
      return undefined;
    }

    return {
      id:
        this.normalizeIdentifier(
          resource.id,
        ),
      type:
        resource.type
          ?.trim() ||
        undefined,
      name:
        resource.name
          ?.trim() ||
        undefined,
    };
  }

  private normalizeError(
    error?:
      LogErrorDetails | Error,
  ): LogErrorDetails | undefined {
    if (!error) {
      return undefined;
    }

    if (error instanceof Error) {
      const errorWithCode =
        error as Error & {
          code?: unknown;
        };

      return {
        name:
          error.name ||
          'Error',
        message:
          error.message
            ? sanitizeLogMessage(
                error.message,
              )
            : undefined,
        code:
          typeof errorWithCode
            .code === 'string'
            ? errorWithCode.code
            : undefined,
        stack:
          error.stack
            ? sanitizeLogMessage(
                error.stack,
              )
            : undefined,
      };
    }

    return {
      name:
        error.name
          ?.trim() ||
        undefined,
      message:
        error.message
          ? sanitizeLogMessage(
              error.message,
            )
          : undefined,
      code:
        error.code
          ?.trim() ||
        undefined,
      stack:
        error.stack
          ? sanitizeLogMessage(
              error.stack,
            )
          : undefined,
    };
  }

  private normalizeTags(
    tags?:
      readonly string[],
  ): readonly string[] {
    return [
      ...new Set(
        (tags ?? [])
          .map(
            (tag) =>
              tag
                .trim()
                .toLowerCase(),
          )
          .filter(Boolean),
      ),
    ].sort();
  }

  private countValues(
    values:
      readonly string[],
  ):
    Readonly<
      Record<string, number>
    > {
    const counts:
      Record<string, number> =
        {};

    for (const value of values) {
      counts[value] =
        (counts[value] ?? 0) +
        1;
    }

    return counts;
  }
}