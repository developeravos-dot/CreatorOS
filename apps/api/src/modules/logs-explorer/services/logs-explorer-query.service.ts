import {
  Injectable,
} from '@nestjs/common';

import type {
  LogCorrelationGroup,
  LogEntry,
  LogEntryListQuery,
  LogEntryListResult,
  LogErrorSummary,
  LogErrorSummaryItem,
  LogSearchStatistics,
  LogTraceGroup,
} from '../contracts';
import {
  isLogTimestampInRange,
} from '../utils';
import {
  LogsExplorerEngineService,
} from './logs-explorer-engine.service';

@Injectable()
export class LogsExplorerQueryService {
  constructor(
    private readonly engine:
      LogsExplorerEngineService,
  ) {}

  search(
    query:
      LogEntryListQuery = {},
  ): LogEntryListResult {
    const filtered =
      this.filter(
        this.engine.list(),
        query,
      );

    const sorted =
      this.sort(
        filtered,
        query.sortDirection ??
          'desc',
      );

    const page =
      this.normalizePage(
        query.page,
      );

    const pageSize =
      this.normalizePageSize(
        query.pageSize,
      );

    const totalItems =
      sorted.length;

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          totalItems /
          pageSize,
        ),
      );

    const safePage =
      Math.min(
        page,
        totalPages,
      );

    const offset =
      (safePage - 1) *
      pageSize;

    const entries =
      sorted.slice(
        offset,
        offset + pageSize,
      );

    return {
      count:
        entries.length,
      total:
        totalItems,
      pagination: {
        page:
          safePage,
        pageSize,
        totalItems,
        totalPages,
        hasPreviousPage:
          safePage > 1,
        hasNextPage:
          safePage <
          totalPages,
      },
      entries:
        entries.map(
          (entry) =>
            this.cloneEntry(
              entry,
            ),
        ),
    };
  }

  allMatching(
    query:
      LogEntryListQuery = {},
  ): readonly LogEntry[] {
    return this.sort(
      this.filter(
        this.engine.list(),
        query,
      ),
      query.sortDirection ??
        'desc',
    ).map(
      (entry) =>
        this.cloneEntry(
          entry,
        ),
    );
  }

  statistics(
    query:
      LogEntryListQuery = {},
  ): LogSearchStatistics {
    const entries =
      this.filter(
        this.engine.list(),
        query,
      );

    return {
      totalMatched:
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
      correlations:
        new Set(
          entries
            .map(
              (entry) =>
                entry.correlationId,
            )
            .filter(Boolean),
        ).size,
      traces:
        new Set(
          entries
            .map(
              (entry) =>
                entry.traceId,
            )
            .filter(Boolean),
        ).size,
      errors:
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

  getCorrelationGroup(
    correlationId: string,
  ):
    | LogCorrelationGroup
    | undefined {
    const normalized =
      correlationId.trim();

    if (!normalized) {
      return undefined;
    }

    const entries =
      this.engine.list()
        .filter(
          (entry) =>
            entry.correlationId ===
            normalized,
        )
        .sort(
          (left, right) =>
            left.timestamp
              .localeCompare(
                right.timestamp,
              ),
        );

    if (entries.length === 0) {
      return undefined;
    }

    return {
      correlationId:
        normalized,
      entryCount:
        entries.length,
      firstTimestamp:
        entries[0]!.timestamp,
      lastTimestamp:
        entries[
          entries.length - 1
        ]!.timestamp,
      levels:
        this.countValues(
          entries.map(
            (entry) =>
              entry.level,
          ),
        ),
      sources: [
        ...new Set(
          entries.map(
            (entry) =>
              entry.source,
          ),
        ),
      ],
      contexts: [
        ...new Set(
          entries.map(
            (entry) =>
              entry.context,
          ),
        ),
      ],
      entries:
        entries.map(
          (entry) =>
            this.cloneEntry(
              entry,
            ),
        ),
    };
  }

  listCorrelationGroups():
    readonly LogCorrelationGroup[] {
    const correlationIds = [
      ...new Set(
        this.engine.list()
          .map(
            (entry) =>
              entry.correlationId,
          )
          .filter(
            (
              value,
            ): value is string =>
              Boolean(value),
          ),
      ),
    ];

    return correlationIds
      .map(
        (correlationId) =>
          this.getCorrelationGroup(
            correlationId,
          ),
      )
      .filter(
        (
          group,
        ): group is
          LogCorrelationGroup =>
            Boolean(group),
      )
      .sort(
        (left, right) =>
          right.lastTimestamp
            .localeCompare(
              left.lastTimestamp,
            ),
      );
  }

  getTraceGroup(
    traceId: string,
  ):
    | LogTraceGroup
    | undefined {
    const normalized =
      traceId.trim();

    if (!normalized) {
      return undefined;
    }

    const entries =
      this.engine.list()
        .filter(
          (entry) =>
            entry.traceId ===
            normalized,
        )
        .sort(
          (left, right) =>
            left.timestamp
              .localeCompare(
                right.timestamp,
              ),
        );

    if (entries.length === 0) {
      return undefined;
    }

    return {
      traceId:
        normalized,
      entryCount:
        entries.length,
      firstTimestamp:
        entries[0]!.timestamp,
      lastTimestamp:
        entries[
          entries.length - 1
        ]!.timestamp,
      spanIds: [
        ...new Set(
          entries
            .map(
              (entry) =>
                entry.spanId,
            )
            .filter(
              (
                value,
              ): value is string =>
                Boolean(value),
            ),
        ),
      ],
      correlationIds: [
        ...new Set(
          entries
            .map(
              (entry) =>
                entry.correlationId,
            )
            .filter(
              (
                value,
              ): value is string =>
                Boolean(value),
            ),
        ),
      ],
      entries:
        entries.map(
          (entry) =>
            this.cloneEntry(
              entry,
            ),
        ),
    };
  }

  listTraceGroups():
    readonly LogTraceGroup[] {
    const traceIds = [
      ...new Set(
        this.engine.list()
          .map(
            (entry) =>
              entry.traceId,
          )
          .filter(
            (
              value,
            ): value is string =>
              Boolean(value),
          ),
      ),
    ];

    return traceIds
      .map(
        (traceId) =>
          this.getTraceGroup(
            traceId,
          ),
      )
      .filter(
        (
          group,
        ): group is
          LogTraceGroup =>
            Boolean(group),
      )
      .sort(
        (left, right) =>
          right.lastTimestamp
            .localeCompare(
              left.lastTimestamp,
            ),
      );
  }

  errorSummary(
    query:
      LogEntryListQuery = {},
  ): LogErrorSummary {
    const entries =
      this.allMatching({
        ...query,
        levels: [
          'error',
          'fatal',
        ],
      });

    const items:
      LogErrorSummaryItem[] =
        entries.map(
          (entry) => ({
            id:
              entry.id,
            timestamp:
              entry.timestamp,
            level:
              entry.level ===
              'fatal'
                ? 'fatal'
                : 'error',
            source:
              entry.source,
            context:
              entry.context,
            message:
              entry.message,
            errorName:
              entry.error?.name,
            errorCode:
              entry.error?.code,
            correlationId:
              entry.correlationId,
            traceId:
              entry.traceId,
            resourceId:
              entry.resource?.id,
          }),
        );

    return {
      count:
        items.length,
      total:
        items.length,
      entries:
        items,
      levels:
        this.countValues(
          items.map(
            (entry) =>
              entry.level,
          ),
        ),
      sources:
        this.countValues(
          items.map(
            (entry) =>
              entry.source,
          ),
        ),
      contexts:
        this.countValues(
          items.map(
            (entry) =>
              entry.context,
          ),
        ),
      generatedAt:
        new Date().toISOString(),
    };
  }

  private filter(
    entries:
      readonly LogEntry[],
    query:
      LogEntryListQuery,
  ): readonly LogEntry[] {
    const search =
      query.search
        ?.trim()
        .toLowerCase();

    const correlationId =
      query.correlationId
        ?.trim()
        .toLowerCase();

    const requestId =
      query.requestId
        ?.trim()
        .toLowerCase();

    const traceId =
      query.traceId
        ?.trim()
        .toLowerCase();

    const resourceId =
      query.resourceId
        ?.trim()
        .toLowerCase();

    const actorId =
      query.actorId
        ?.trim()
        .toLowerCase();

    const levels =
      new Set(
        query.levels ?? [],
      );

    const sources =
      new Set(
        query.sources ?? [],
      );

    const contexts =
      new Set(
        (query.contexts ?? [])
          .map(
            (context) =>
              context
                .trim()
                .toLowerCase(),
          )
          .filter(Boolean),
      );

    return entries.filter(
      (entry) => {
        if (
          levels.size > 0 &&
          !levels.has(
            entry.level,
          )
        ) {
          return false;
        }

        if (
          sources.size > 0 &&
          !sources.has(
            entry.source,
          )
        ) {
          return false;
        }

        if (
          contexts.size > 0 &&
          !contexts.has(
            entry.context
              .toLowerCase(),
          )
        ) {
          return false;
        }

        if (
          correlationId &&
          entry.correlationId
            ?.toLowerCase() !==
            correlationId
        ) {
          return false;
        }

        if (
          requestId &&
          entry.requestId
            ?.toLowerCase() !==
            requestId
        ) {
          return false;
        }

        if (
          traceId &&
          entry.traceId
            ?.toLowerCase() !==
            traceId
        ) {
          return false;
        }

        if (
          resourceId &&
          entry.resource?.id
            ?.toLowerCase() !==
            resourceId
        ) {
          return false;
        }

        if (
          actorId &&
          entry.actor?.id
            ?.toLowerCase() !==
            actorId
        ) {
          return false;
        }

        if (
          !isLogTimestampInRange(
            entry.timestamp,
            query.from,
            query.to,
          )
        ) {
          return false;
        }

        if (search) {
          const searchable =
            [
              entry.id,
              entry.level,
              entry.source,
              entry.context,
              entry.message,
              entry.correlationId,
              entry.requestId,
              entry.traceId,
              entry.spanId,
              entry.actor?.id,
              entry.actor
                ?.displayName,
              entry.resource?.id,
              entry.resource?.type,
              entry.resource?.name,
              entry.error?.name,
              entry.error?.message,
              entry.error?.code,
              ...entry.tags,
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();

          if (
            !searchable.includes(
              search,
            )
          ) {
            return false;
          }
        }

        return true;
      },
    );
  }

  private sort(
    entries:
      readonly LogEntry[],
    direction:
      | 'asc'
      | 'desc',
  ): readonly LogEntry[] {
    const multiplier =
      direction === 'asc'
        ? 1
        : -1;

    return [
      ...entries,
    ].sort(
      (left, right) =>
        left.timestamp
          .localeCompare(
            right.timestamp,
          ) * multiplier,
    );
  }

  private normalizePage(
    page?: number,
  ): number {
    if (
      typeof page !==
        'number' ||
      !Number.isFinite(page)
    ) {
      return 1;
    }

    return Math.max(
      1,
      Math.floor(page),
    );
  }

  private normalizePageSize(
    pageSize?: number,
  ): number {
    if (
      typeof pageSize !==
        'number' ||
      !Number.isFinite(
        pageSize,
      )
    ) {
      return 50;
    }

    return Math.max(
      1,
      Math.min(
        500,
        Math.floor(
          pageSize,
        ),
      ),
    );
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

  private cloneEntry(
    entry:
      LogEntry,
  ): LogEntry {
    return {
      ...entry,
      actor:
        entry.actor
          ? {
              ...entry.actor,
            }
          : undefined,
      resource:
        entry.resource
          ? {
              ...entry.resource,
            }
          : undefined,
      error:
        entry.error
          ? {
              ...entry.error,
            }
          : undefined,
      metadata: {
        ...entry.metadata,
      },
      tags: [
        ...entry.tags,
      ],
    };
  }
}