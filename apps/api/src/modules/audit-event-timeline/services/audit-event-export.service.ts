import {
  Injectable,
} from '@nestjs/common';

import type {
  AuditEvent,
  AuditEventExportRequest,
  AuditEventExportResult,
} from '../contracts';
import {
  AuditEventQueryService,
} from './audit-event-query.service';

@Injectable()
export class AuditEventExportService {
  constructor(
    private readonly query:
      AuditEventQueryService,
  ) {}

  export(
    request:
      AuditEventExportRequest,
  ): AuditEventExportResult {
    const events =
      this.query.allMatching(
        request.query ?? {},
      );

    const generatedAt =
      new Date().toISOString();

    const timestamp =
      generatedAt
        .replace(
          /[:.]/g,
          '-',
        );

    if (
      request.format ===
      'csv'
    ) {
      return {
        format: 'csv',
        contentType:
          'text/csv; charset=utf-8',
        filename:
          `creatoros-audit-events-${timestamp}.csv`,
        eventCount:
          events.length,
        content:
          this.toCsv(events),
        generatedAt,
      };
    }

    return {
      format: 'json',
      contentType:
        'application/json; charset=utf-8',
      filename:
        `creatoros-audit-events-${timestamp}.json`,
      eventCount:
        events.length,
      content:
        JSON.stringify(
          {
            generatedAt,
            eventCount:
              events.length,
            events,
          },
          null,
          2,
        ),
      generatedAt,
    };
  }

  private toCsv(
    events:
      readonly AuditEvent[],
  ): string {
    const headers = [
      'id',
      'occurredAt',
      'recordedAt',
      'eventType',
      'category',
      'severity',
      'outcome',
      'message',
      'correlationId',
      'causationId',
      'actorId',
      'actorType',
      'actorDisplayName',
      'resourceId',
      'resourceType',
      'resourceName',
      'tags',
      'metadata',
      'changes',
    ];

    const rows =
      events.map(
        (event) => [
          event.id,
          event.occurredAt,
          event.recordedAt,
          event.eventType,
          event.category,
          event.severity,
          event.outcome,
          event.message,
          event.correlationId ??
            '',
          event.causationId ??
            '',
          event.actor?.id ??
            '',
          event.actor?.type ??
            '',
          event.actor
            ?.displayName ??
            '',
          event.resource?.id ??
            '',
          event.resource?.type ??
            '',
          event.resource?.name ??
            '',
          event.tags.join('|'),
          JSON.stringify(
            event.metadata,
          ),
          JSON.stringify(
            event.changes,
          ),
        ],
      );

    return [
      headers,
      ...rows,
    ]
      .map(
        (row) =>
          row
            .map(
              (value) =>
                this.escapeCsv(
                  String(value),
                ),
            )
            .join(','),
      )
      .join('\r\n');
  }

  private escapeCsv(
    value: string,
  ): string {
    const escaped =
      value.replace(
        /"/g,
        '""',
      );

    if (
      /[",\r\n]/.test(
        escaped,
      )
    ) {
      return `"${escaped}"`;
    }

    return escaped;
  }
}