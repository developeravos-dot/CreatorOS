import {
  Injectable,
} from '@nestjs/common';

import type {
  LogEntry,
  LogExportRequest,
  LogExportResult,
} from '../contracts';
import {
  LogsExplorerQueryService,
} from './logs-explorer-query.service';

@Injectable()
export class LogsExplorerExportService {
  constructor(
    private readonly query:
      LogsExplorerQueryService,
  ) {}

  export(
    request:
      LogExportRequest,
  ): LogExportResult {
    const entries =
      this.query.allMatching(
        request.query ?? {},
      );

    const generatedAt =
      new Date().toISOString();

    const filenameTimestamp =
      generatedAt.replace(
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
          `creatoros-logs-${filenameTimestamp}.csv`,
        entryCount:
          entries.length,
        content:
          this.toCsv(entries),
        generatedAt,
      };
    }

    return {
      format: 'json',
      contentType:
        'application/json; charset=utf-8',
      filename:
        `creatoros-logs-${filenameTimestamp}.json`,
      entryCount:
        entries.length,
      content:
        JSON.stringify(
          {
            generatedAt,
            entryCount:
              entries.length,
            entries,
          },
          null,
          2,
        ),
      generatedAt,
    };
  }

  private toCsv(
    entries:
      readonly LogEntry[],
  ): string {
    const headers = [
      'id',
      'timestamp',
      'recordedAt',
      'level',
      'source',
      'context',
      'message',
      'correlationId',
      'requestId',
      'traceId',
      'spanId',
      'actorId',
      'actorType',
      'actorDisplayName',
      'resourceId',
      'resourceType',
      'resourceName',
      'errorName',
      'errorMessage',
      'errorCode',
      'tags',
      'metadata',
    ];

    const rows =
      entries.map(
        (entry) => [
          entry.id,
          entry.timestamp,
          entry.recordedAt,
          entry.level,
          entry.source,
          entry.context,
          entry.message,
          entry.correlationId ??
            '',
          entry.requestId ??
            '',
          entry.traceId ??
            '',
          entry.spanId ??
            '',
          entry.actor?.id ??
            '',
          entry.actor?.type ??
            '',
          entry.actor
            ?.displayName ??
            '',
          entry.resource?.id ??
            '',
          entry.resource?.type ??
            '',
          entry.resource?.name ??
            '',
          entry.error?.name ??
            '',
          entry.error?.message ??
            '',
          entry.error?.code ??
            '',
          entry.tags.join('|'),
          JSON.stringify(
            entry.metadata,
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