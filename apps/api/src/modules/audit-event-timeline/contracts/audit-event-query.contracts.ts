import type {
  AuditEvent,
  AuditTimelineEntry,
} from './audit-event-timeline.contracts';

export interface AuditCorrelationGroup {
  readonly correlationId: string;
  readonly eventCount: number;
  readonly firstOccurredAt: string;
  readonly lastOccurredAt: string;
  readonly eventTypes:
    readonly string[];
  readonly events:
    readonly AuditTimelineEntry[];
}

export interface AuditRelatedEventsResult {
  readonly sourceEvent:
    AuditEvent;
  readonly relatedByCorrelation:
    readonly AuditEvent[];
  readonly relatedByCausation:
    readonly AuditEvent[];
  readonly relatedByResource:
    readonly AuditEvent[];
  readonly count: number;
}

export interface AuditTimelineResult {
  readonly count: number;
  readonly total: number;
  readonly entries:
    readonly AuditTimelineEntry[];
}

export interface AuditSearchStatistics {
  readonly totalMatched: number;
  readonly categories:
    Readonly<Record<string, number>>;
  readonly severities:
    Readonly<Record<string, number>>;
  readonly outcomes:
    Readonly<Record<string, number>>;
  readonly eventTypes:
    Readonly<Record<string, number>>;
  readonly correlations: number;
  readonly generatedAt: string;
}