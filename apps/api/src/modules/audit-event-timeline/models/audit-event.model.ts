import type {
  AuditEvent,
  AuditEventActor,
  AuditEventCategory,
  AuditEventChange,
  AuditEventOutcome,
  AuditEventResource,
  AuditEventSeverity,
} from '../contracts';

export class AuditEventModel
  implements AuditEvent {
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

  constructor(
    event: AuditEvent,
  ) {
    this.id =
      event.id;

    this.eventType =
      event.eventType;

    this.category =
      event.category;

    this.severity =
      event.severity;

    this.outcome =
      event.outcome;

    this.message =
      event.message;

    this.occurredAt =
      event.occurredAt;

    this.recordedAt =
      event.recordedAt;

    this.correlationId =
      event.correlationId;

    this.causationId =
      event.causationId;

    this.actor =
      event.actor
        ? {
            ...event.actor,
          }
        : undefined;

    this.resource =
      event.resource
        ? {
            ...event.resource,
          }
        : undefined;

    this.changes =
      event.changes.map(
        (change) => ({
          ...change,
        }),
      );

    this.metadata = {
      ...event.metadata,
    };

    this.tags = [
      ...event.tags,
    ];
  }

  toContract(): AuditEvent {
    return {
      id:
        this.id,
      eventType:
        this.eventType,
      category:
        this.category,
      severity:
        this.severity,
      outcome:
        this.outcome,
      message:
        this.message,
      occurredAt:
        this.occurredAt,
      recordedAt:
        this.recordedAt,
      correlationId:
        this.correlationId,
      causationId:
        this.causationId,
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
      changes:
        this.changes.map(
          (change) => ({
            ...change,
          }),
        ),
      metadata: {
        ...this.metadata,
      },
      tags: [
        ...this.tags,
      ],
    };
  }
}