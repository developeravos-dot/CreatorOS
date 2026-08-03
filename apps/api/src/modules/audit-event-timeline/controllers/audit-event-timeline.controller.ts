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
  AuditEventActor,
  AuditEventChange,
  AuditEventListQuery,
  AuditEventResource,
} from '../contracts';
import {
  AuditEventExportDto,
  AuditEventListQueryDto,
  RecordAuditEventDto,
} from '../dto';
import {
  AuditEventEngineService,
  AuditEventExportService,
  AuditEventQueryService,
} from '../services';

@Controller('audit')
export class AuditEventTimelineController {
  constructor(
    private readonly engine:
      AuditEventEngineService,
    private readonly query:
      AuditEventQueryService,
    private readonly exporter:
      AuditEventExportService,
  ) {}

  @Get('events')
  listEvents(
    @Query()
    query:
      AuditEventListQueryDto,
  ) {
    return this.query.search(
      query,
    );
  }

  @Get('search')
  search(
    @Query()
    query:
      AuditEventListQueryDto,
  ) {
    return this.query.search(
      query,
    );
  }

  @Get('timeline')
  timeline(
    @Query()
    query:
      AuditEventListQueryDto,
  ) {
    return this.query.timeline(
      query,
    );
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
    const result =
      this.query.getCorrelationGroup(
        correlationId,
      );

    if (!result) {
      throw new NotFoundException(
        `Audit correlation ${correlationId} was not found.`,
      );
    }

    return result;
  }

  @Get('statistics')
  statistics(
    @Query()
    query:
      AuditEventListQueryDto,
  ) {
    return this.query.statistics(
      query,
    );
  }

  @Post('events')
  record(
    @Body()
    input:
      RecordAuditEventDto,
  ) {
    return this.engine.record({
      eventType:
        input.eventType,
      category:
        input.category,
      severity:
        input.severity,
      outcome:
        input.outcome,
      message:
        input.message,
      occurredAt:
        input.occurredAt,
      correlationId:
        input.correlationId,
      causationId:
        input.causationId,
      actor:
        input.actor as unknown as
          AuditEventActor | undefined,
      resource:
        input.resource as unknown as
          AuditEventResource | undefined,
      changes:
        input.changes as unknown as
          | readonly AuditEventChange[]
          | undefined,
      metadata:
        input.metadata,
      tags:
        input.tags,
    });
  }

  @Post('export')
  exportEvents(
    @Body()
    input:
      AuditEventExportDto,
  ) {
    return this.exporter.export({
      format:
        input.format,
      query:
        input.query as
          | AuditEventListQuery
          | undefined,
    });
  }

  @Get('events/:eventId/related')
  relatedEvents(
    @Param('eventId')
    eventId: string,
  ) {
    const result =
      this.query.relatedEvents(
        eventId,
      );

    if (!result) {
      throw new NotFoundException(
        `Audit event ${eventId} was not found.`,
      );
    }

    return result;
  }

  @Get('events/:eventId')
  eventDetails(
    @Param('eventId')
    eventId: string,
  ) {
    const event =
      this.engine.getById(
        eventId,
      );

    if (!event) {
      throw new NotFoundException(
        `Audit event ${eventId} was not found.`,
      );
    }

    return event;
  }
}