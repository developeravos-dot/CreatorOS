import {
  Injectable,
} from '@nestjs/common';

import type {
  AuditCorrelationGroup,
  AuditEvent,
  AuditEventListQuery,
  AuditEventListResult,
  AuditRelatedEventsResult,
  AuditSearchStatistics,
  AuditTimelineEntry,
  AuditTimelineResult,
} from '../contracts';
import {
  isAuditTimestampInRange,
} from '../utils';
import {
  AuditEventEngineService,
} from './audit-event-engine.service';

@Injectable()
export class AuditEventQueryService {
  constructor(
    private readonly engine:
      AuditEventEngineService,
  ) {}

  search(
    query:
      AuditEventListQuery = {},
  ): AuditEventListResult {
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

    const events =
      sorted.slice(
        offset,
        offset + pageSize,
      );

    return {
      count:
        events.length,
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
      events:
        events.map(
          (event) =>
            this.cloneEvent(
              event,
            ),
        ),
    };
  }

  timeline(
    query:
      AuditEventListQuery = {},
  ): AuditTimelineResult {
    const result =
      this.search(query);

    return {
      count:
        result.count,
      total:
        result.total,
      entries:
        result.events.map(
          (event) =>
            this.toTimelineEntry(
              event,
            ),
        ),
    };
  }

  getCorrelationGroup(
    correlationId: string,
  ):
    | AuditCorrelationGroup
    | undefined {
    const normalized =
      correlationId.trim();

    if (!normalized) {
      return undefined;
    }

    const events =
      this.engine.list()
        .filter(
          (event) =>
            event.correlationId ===
            normalized,
        )
        .sort(
          (left, right) =>
            left.occurredAt
              .localeCompare(
                right.occurredAt,
              ),
        );

    if (events.length === 0) {
      return undefined;
    }

    return {
      correlationId:
        normalized,
      eventCount:
        events.length,
      firstOccurredAt:
        events[0]!
          .occurredAt,
      lastOccurredAt:
        events[
          events.length - 1
        ]!.occurredAt,
      eventTypes: [
        ...new Set(
          events.map(
            (event) =>
              event.eventType,
          ),
        ),
      ],
      events:
        events.map(
          (event) =>
            this.toTimelineEntry(
              event,
            ),
        ),
    };
  }

  listCorrelationGroups():
    readonly AuditCorrelationGroup[] {
    const correlationIds = [
      ...new Set(
        this.engine.list()
          .map(
            (event) =>
              event.correlationId,
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
          AuditCorrelationGroup =>
            Boolean(group),
      )
      .sort(
        (left, right) =>
          right.lastOccurredAt
            .localeCompare(
              left.lastOccurredAt,
            ),
      );
  }

  relatedEvents(
    eventId: string,
  ):
    | AuditRelatedEventsResult
    | undefined {
    const sourceEvent =
      this.engine.getById(
        eventId,
      );

    if (!sourceEvent) {
      return undefined;
    }

    const candidates =
      this.engine.list()
        .filter(
          (event) =>
            event.id !==
            sourceEvent.id,
        );

    const relatedByCorrelation =
      sourceEvent.correlationId
        ? candidates.filter(
            (event) =>
              event.correlationId ===
              sourceEvent
                .correlationId,
          )
        : [];

    const relatedByCausation =
      candidates.filter(
        (event) =>
          event.causationId ===
            sourceEvent.id ||
          sourceEvent.causationId ===
            event.id,
      );

    const relatedByResource =
      sourceEvent.resource?.id
        ? candidates.filter(
            (event) =>
              event.resource?.id ===
                sourceEvent.resource
                  ?.id &&
              event.resource?.type ===
                sourceEvent.resource
                  ?.type,
          )
        : [];

    const uniqueRelatedIds =
      new Set([
        ...relatedByCorrelation.map(
          (event) =>
            event.id,
        ),
        ...relatedByCausation.map(
          (event) =>
            event.id,
        ),
        ...relatedByResource.map(
          (event) =>
            event.id,
        ),
      ]);

    return {
      sourceEvent:
        this.cloneEvent(
          sourceEvent,
        ),
      relatedByCorrelation:
        relatedByCorrelation.map(
          (event) =>
            this.cloneEvent(
              event,
            ),
        ),
      relatedByCausation:
        relatedByCausation.map(
          (event) =>
            this.cloneEvent(
              event,
            ),
        ),
      relatedByResource:
        relatedByResource.map(
          (event) =>
            this.cloneEvent(
              event,
            ),
        ),
      count:
        uniqueRelatedIds.size,
    };
  }

  statistics(
    query:
      AuditEventListQuery = {},
  ): AuditSearchStatistics {
    const events =
      this.filter(
        this.engine.list(),
        query,
      );

    return {
      totalMatched:
        events.length,
      categories:
        this.countValues(
          events.map(
            (event) =>
              event.category,
          ),
        ),
      severities:
        this.countValues(
          events.map(
            (event) =>
              event.severity,
          ),
        ),
      outcomes:
        this.countValues(
          events.map(
            (event) =>
              event.outcome,
          ),
        ),
      eventTypes:
        this.countValues(
          events.map(
            (event) =>
              event.eventType,
          ),
        ),
      correlations:
        new Set(
          events
            .map(
              (event) =>
                event.correlationId,
            )
            .filter(Boolean),
        ).size,
      generatedAt:
        new Date().toISOString(),
    };
  }

  allMatching(
    query:
      AuditEventListQuery = {},
  ): readonly AuditEvent[] {
    return this.sort(
      this.filter(
        this.engine.list(),
        query,
      ),
      query.sortDirection ??
        'desc',
    ).map(
      (event) =>
        this.cloneEvent(
          event,
        ),
    );
  }

  private filter(
    events:
      readonly AuditEvent[],
    query:
      AuditEventListQuery,
  ): readonly AuditEvent[] {
    const search =
      query.search
        ?.trim()
        .toLowerCase();

    const correlationId =
      query.correlationId
        ?.trim()
        .toLowerCase();

    const actorId =
      query.actorId
        ?.trim()
        .toLowerCase();

    const resourceId =
      query.resourceId
        ?.trim()
        .toLowerCase();

    const resourceType =
      query.resourceType
        ?.trim()
        .toLowerCase();

    const eventType =
      query.eventType
        ?.trim()
        .toLowerCase();

    const categories =
      new Set(
        query.categories ?? [],
      );

    const severities =
      new Set(
        query.severities ?? [],
      );

    const outcomes =
      new Set(
        query.outcomes ?? [],
      );

    return events.filter(
      (event) => {
        if (
          categories.size > 0 &&
          !categories.has(
            event.category,
          )
        ) {
          return false;
        }

        if (
          severities.size > 0 &&
          !severities.has(
            event.severity,
          )
        ) {
          return false;
        }

        if (
          outcomes.size > 0 &&
          !outcomes.has(
            event.outcome,
          )
        ) {
          return false;
        }

        if (
          correlationId &&
          event.correlationId
            ?.toLowerCase() !==
            correlationId
        ) {
          return false;
        }

        if (
          actorId &&
          event.actor?.id
            ?.toLowerCase() !==
            actorId
        ) {
          return false;
        }

        if (
          resourceId &&
          event.resource?.id
            ?.toLowerCase() !==
            resourceId
        ) {
          return false;
        }

        if (
          resourceType &&
          event.resource?.type
            ?.toLowerCase() !==
            resourceType
        ) {
          return false;
        }

        if (
          eventType &&
          event.eventType
            .toLowerCase() !==
            eventType
        ) {
          return false;
        }

        if (
          !isAuditTimestampInRange(
            event.occurredAt,
            query.from,
            query.to,
          )
        ) {
          return false;
        }

        if (search) {
          const searchable =
            [
              event.id,
              event.eventType,
              event.category,
              event.severity,
              event.outcome,
              event.message,
              event.correlationId,
              event.causationId,
              event.actor?.id,
              event.actor
                ?.displayName,
              event.resource?.id,
              event.resource?.type,
              event.resource?.name,
              ...event.tags,
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
    events:
      readonly AuditEvent[],
    direction:
      | 'asc'
      | 'desc',
  ): readonly AuditEvent[] {
    const multiplier =
      direction === 'asc'
        ? 1
        : -1;

    return [
      ...events,
    ].sort(
      (left, right) =>
        left.occurredAt
          .localeCompare(
            right.occurredAt,
          ) * multiplier,
    );
  }

  private normalizePage(
    page?: number,
  ): number {
    if (
      typeof page !== 'number' ||
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
        Math.floor(pageSize),
      ),
    );
  }

  private toTimelineEntry(
    event:
      AuditEvent,
  ): AuditTimelineEntry {
    return {
      id:
        event.id,
      occurredAt:
        event.occurredAt,
      eventType:
        event.eventType,
      category:
        event.category,
      severity:
        event.severity,
      outcome:
        event.outcome,
      message:
        event.message,
      correlationId:
        event.correlationId,
      resource:
        event.resource
          ? {
              ...event.resource,
            }
          : undefined,
    };
  }

  private cloneEvent(
    event:
      AuditEvent,
  ): AuditEvent {
    return {
      ...event,
      actor:
        event.actor
          ? {
              ...event.actor,
            }
          : undefined,
      resource:
        event.resource
          ? {
              ...event.resource,
            }
          : undefined,
      changes:
        event.changes.map(
          (change) => ({
            ...change,
          }),
        ),
      metadata: {
        ...event.metadata,
      },
      tags: [
        ...event.tags,
      ],
    };
  }

  private countValues(
    values:
      readonly string[],
  ):
    Readonly<
      Record<string, number>
    > {
    const result:
      Record<string, number> =
        {};

    for (const value of values) {
      result[value] =
        (result[value] ?? 0) +
        1;
    }

    return result;
  }
}