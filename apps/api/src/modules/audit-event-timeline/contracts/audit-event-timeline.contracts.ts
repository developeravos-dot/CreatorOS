export const AUDIT_EVENT_SEVERITIES = [
  'debug',
  'info',
  'warning',
  'error',
  'critical',
] as const;

export type AuditEventSeverity =
  (typeof AUDIT_EVENT_SEVERITIES)[number];

export const AUDIT_EVENT_CATEGORIES = [
  'system',
  'security',
  'capability',
  'runtime',
  'dependency',
  'plugin',
  'persistence',
  'user',
  'integration',
  'monitoring',
  'other',
] as const;

export type AuditEventCategory =
  (typeof AUDIT_EVENT_CATEGORIES)[number];

export const AUDIT_EVENT_OUTCOMES = [
  'success',
  'failure',
  'partial',
  'unknown',
] as const;

export type AuditEventOutcome =
  (typeof AUDIT_EVENT_OUTCOMES)[number];

export interface AuditEventActor {
  readonly id?: string;
  readonly type?:
    | 'user'
    | 'service'
    | 'agent'
    | 'system'
    | 'unknown';
  readonly displayName?: string;
}

export interface AuditEventResource {
  readonly id?: string;
  readonly type?: string;
  readonly name?: string;
}

export interface AuditEventChange {
  readonly field: string;
  readonly previousValue?: unknown;
  readonly currentValue?: unknown;
}

export interface AuditEvent {
  readonly id: string;
  readonly eventType: string;
  readonly category:
    AuditEventCategory;
  readonly severity:
    AuditEventSeverity;
  readonly outcome:
    AuditEventOutcome;
  readonly message: string;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly actor?:
    AuditEventActor;
  readonly resource?:
    AuditEventResource;
  readonly changes:
    readonly AuditEventChange[];
  readonly metadata:
    Readonly<Record<string, unknown>>;
  readonly tags:
    readonly string[];
}

export interface RecordAuditEventInput {
  readonly id?: string;
  readonly eventType: string;
  readonly category?:
    AuditEventCategory;
  readonly severity?:
    AuditEventSeverity;
  readonly outcome?:
    AuditEventOutcome;
  readonly message: string;
  readonly occurredAt?:
    string | Date;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly actor?:
    AuditEventActor;
  readonly resource?:
    AuditEventResource;
  readonly changes?:
    readonly AuditEventChange[];
  readonly metadata?:
    Readonly<Record<string, unknown>>;
  readonly tags?:
    readonly string[];
}

export interface AuditEventListQuery {
  readonly search?: string;
  readonly categories?:
    readonly AuditEventCategory[];
  readonly severities?:
    readonly AuditEventSeverity[];
  readonly outcomes?:
    readonly AuditEventOutcome[];
  readonly correlationId?: string;
  readonly actorId?: string;
  readonly resourceId?: string;
  readonly resourceType?: string;
  readonly eventType?: string;
  readonly from?: string;
  readonly to?: string;
  readonly sortDirection?:
    | 'asc'
    | 'desc';
  readonly page?: number;
  readonly pageSize?: number;
}

export interface AuditEventPagination {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
}

export interface AuditEventListResult {
  readonly count: number;
  readonly total: number;
  readonly pagination:
    AuditEventPagination;
  readonly events:
    readonly AuditEvent[];
}

export interface AuditTimelineEntry {
  readonly id: string;
  readonly occurredAt: string;
  readonly eventType: string;
  readonly category:
    AuditEventCategory;
  readonly severity:
    AuditEventSeverity;
  readonly outcome:
    AuditEventOutcome;
  readonly message: string;
  readonly correlationId?: string;
  readonly resource?:
    AuditEventResource;
}

export interface AuditEventExportRequest {
  readonly format:
    | 'json'
    | 'csv';
  readonly query?:
    AuditEventListQuery;
}

export interface AuditEventExportResult {
  readonly format:
    | 'json'
    | 'csv';
  readonly contentType: string;
  readonly filename: string;
  readonly eventCount: number;
  readonly content: string;
  readonly generatedAt: string;
}

export interface AuditEventEngineMetrics {
  readonly totalEvents: number;
  readonly categories:
    Readonly<Record<string, number>>;
  readonly severities:
    Readonly<Record<string, number>>;
  readonly outcomes:
    Readonly<Record<string, number>>;
  readonly correlatedEvents: number;
  readonly generatedAt: string;
}