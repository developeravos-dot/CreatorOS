import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import type {
  LogActor,
  LogEntryListQuery,
  LogErrorDetails,
  LogResource,
} from '../contracts';
import {
  LogEntryListQueryDto,
  LogExportDto,
  RecordLogEntryDto,
} from '../dto';
import {
  LogsExplorerEngineService,
  LogsExplorerExportService,
  LogsExplorerQueryService,
} from '../services';

@Controller('logs')
export class LogsExplorerController {
  constructor(
    private readonly engine:
      LogsExplorerEngineService,
    private readonly query:
      LogsExplorerQueryService,
    private readonly exporter:
      LogsExplorerExportService,
  ) {}

  @Get()
  list(
    @Query()
    query:
      LogEntryListQueryDto,
  ) {
    return this.query.search(
      query,
    );
  }

  @Get('search')
  search(
    @Query()
    query:
      LogEntryListQueryDto,
  ) {
    return this.query.search(
      query,
    );
  }

  @Get('statistics')
  statistics(
    @Query()
    query:
      LogEntryListQueryDto,
  ) {
    return this.query.statistics(
      query,
    );
  }

  @Get('errors')
  errors(
    @Query()
    query:
      LogEntryListQueryDto,
  ) {
    return this.query.errorSummary(
      query,
    );
  }

  @Get('metrics')
  metrics() {
    return this.engine.metrics();
  }

  @Get('correlations')
  correlations() {
    return this.query
      .listCorrelationGroups();
  }

  @Get('correlations/:correlationId')
  correlation(
    @Param('correlationId')
    correlationId: string,
  ) {
    const group =
      this.query.getCorrelationGroup(
        correlationId,
      );

    if (!group) {
      throw new NotFoundException(
        `Log correlation ${correlationId} was not found.`,
      );
    }

    return group;
  }

  @Get('traces')
  traces() {
    return this.query
      .listTraceGroups();
  }

  @Get('traces/:traceId')
  trace(
    @Param('traceId')
    traceId: string,
  ) {
    const group =
      this.query.getTraceGroup(
        traceId,
      );

    if (!group) {
      throw new NotFoundException(
        `Log trace ${traceId} was not found.`,
      );
    }

    return group;
  }

  @Post()
  record(
    @Body()
    input:
      RecordLogEntryDto,
  ) {
    return this.engine.record({
      level:
        input.level,
      source:
        input.source,
      context:
        input.context,
      message:
        input.message,
      timestamp:
        input.timestamp,
      correlationId:
        input.correlationId,
      requestId:
        input.requestId,
      traceId:
        input.traceId,
      spanId:
        input.spanId,
      actor:
        input.actor as unknown as
          LogActor | undefined,
      resource:
        input.resource as unknown as
          LogResource | undefined,
      error:
        input.error as unknown as
          LogErrorDetails | undefined,
      metadata:
        input.metadata,
      tags:
        input.tags,
    });
  }

  @Post('export')
  exportLogs(
    @Body()
    input:
      LogExportDto,
  ) {
    return this.exporter.export({
      format:
        input.format,
      query:
        input.query as
          | LogEntryListQuery
          | undefined,
    });
  }

  @Get(':entryId')
  details(
    @Param('entryId')
    entryId: string,
  ) {
    const entry =
      this.engine.getById(
        entryId,
      );

    if (!entry) {
      throw new NotFoundException(
        `Log entry ${entryId} was not found.`,
      );
    }

    return entry;
  }
}