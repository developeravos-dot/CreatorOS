import {
  Injectable,
} from '@nestjs/common';
import {
  randomUUID,
} from 'node:crypto';

import type {
  AuditEvent,
  AuditEventActor,
  AuditEventChange,
  AuditEventEngineMetrics,
  AuditEventResource,
  RecordAuditEventInput,
} from '../contracts';
import {
  AuditEventModel,
} from '../models';
import {
  normalizeAuditTimestamp,
  sanitizeAuditRecord,
  sanitizeAuditValue,
} from '../utils';

@Injectable()
export class AuditEventEngineService {
  private readonly events =
    new Map<string, AuditEventModel>();

  record(
    input:
      RecordAuditEventInput,
  ): AuditEvent {
    const id =
      this.normalizeIdentifier(
        input.id,
      ) ?? randomUUID();

    if (this.events.has(id)) {
      throw new Error(
        `Audit event ${id} already exists.`,
      );
    }

    const now =
      new Date();

    const event =
      new AuditEventModel({
        id,
        eventType:
          this.requiredText(
            input.eventType,
            'eventType',
          ),
        category:
          input.category ??
          'other',
        severity:
          input.severity ??
          this.defaultSeverity(
            input.outcome,
          ),
        outcome:
          input.outcome ??
          'unknown',
        message:
          this.sanitizeMessage(
            this.requiredText(
              input.message,
              'message',
            ),
          ),
        occurredAt:
          normalizeAuditTimestamp(
            input.occurredAt,
            now,
          ),
        recordedAt:
          now.toISOString(),
        correlationId:
          this.normalizeIdentifier(
            input.correlationId,
          ),
        causationId:
          this.normalizeIdentifier(
            input.causationId,
          ),
        actor:
          this.normalizeActor(
            input.actor,
          ),
        resource:
          this.normalizeResource(
            input.resource,
          ),
        changes:
          this.normalizeChanges(
            input.changes,
          ),
        metadata:
          sanitizeAuditRecord(
            input.metadata ?? {},
          ),
        tags:
          this.normalizeTags(
            input.tags,
          ),
      });

    this.events.set(
      event.id,
      event,
    );

    return event.toContract();
  }

  getById(
    eventId: string,
  ): AuditEvent | undefined {
    return this.events
      .get(eventId)
      ?.toContract();
  }

  list():
    readonly AuditEvent[] {
    return [
      ...this.events.values(),
    ]
      .sort(
        (left, right) =>
          right.occurredAt
            .localeCompare(
              left.occurredAt,
            ),
      )
      .map(
        (event) =>
          event.toContract(),
      );
  }

  count(): number {
    return this.events.size;
  }

  metrics():
    AuditEventEngineMetrics {
    const events =
      this.list();

    return {
      totalEvents:
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
      correlatedEvents:
        events.filter(
          (event) =>
            Boolean(
              event.correlationId,
            ),
        ).length,
      generatedAt:
        new Date().toISOString(),
    };
  }

  clear(): void {
    this.events.clear();
  }

  private defaultSeverity(
    outcome:
      RecordAuditEventInput['outcome'],
  ) {
    switch (outcome) {
      case 'failure':
        return 'error' as const;

      case 'partial':
        return 'warning' as const;

      case 'success':
      case 'unknown':
      default:
        return 'info' as const;
    }
  }

  private requiredText(
    value: string,
    field: string,
  ): string {
    const normalized =
      value?.trim();

    if (!normalized) {
      throw new Error(
        `Audit event ${field} is required.`,
      );
    }

    return normalized;
  }

  private normalizeIdentifier(
    value?: string,
  ): string | undefined {
    const normalized =
      value?.trim();

    return normalized ||
      undefined;
  }

  private sanitizeMessage(
    value: string,
  ): string {
    const sanitized =
      sanitizeAuditValue(value);

    return typeof sanitized ===
      'string'
      ? sanitized
      : String(sanitized);
  }

  private normalizeActor(
    actor?:
      AuditEventActor,
  ):
    | AuditEventActor
    | undefined {
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
    resource?:
      AuditEventResource,
  ):
    | AuditEventResource
    | undefined {
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

  private normalizeChanges(
    changes?:
      readonly AuditEventChange[],
  ):
    readonly AuditEventChange[] {
    return (
      changes ?? []
    ).map(
      (change) => ({
        field:
          this.requiredText(
            change.field,
            'change.field',
          ),
        previousValue:
          sanitizeAuditValue(
            change.previousValue,
          ),
        currentValue:
          sanitizeAuditValue(
            change.currentValue,
          ),
      }),
    );
  }

  private normalizeTags(
    tags?:
      readonly string[],
  ):
    readonly string[] {
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