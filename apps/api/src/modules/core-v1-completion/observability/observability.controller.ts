import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../security/permissions';
import { RequirePermissions } from '../security/permissions.decorator';
import {
  CreateAlertRuleDto,
  QueryTelemetryDto,
  RecordHealthDto,
  RecordLogDto,
  RecordMetricDto,
  RecordTraceDto,
  TransitionAlertDto,
  UpdateAlertRuleDto,
} from './dto/observability.dto';
import { ObservabilityService } from './observability.service';

@ApiTags('Observability & Telemetry')
@ApiBearerAuth()
@Controller('observability')
export class ObservabilityController {
  constructor(private readonly observability: ObservabilityService) {}

  @Get('dashboard')
  @RequirePermissions(Permissions.ObservabilityDashboardRead)
  dashboard() { return this.observability.dashboard(); }

  @Get('metrics')
  @RequirePermissions(Permissions.TelemetryRead)
  metrics(@Query() query: QueryTelemetryDto) { return this.observability.listMetrics(query); }

  @Post('metrics')
  @RequirePermissions(Permissions.TelemetryWrite)
  recordMetric(@Body() body: RecordMetricDto) { return this.observability.recordMetric(body); }

  @Get('health')
  @RequirePermissions(Permissions.TelemetryRead)
  health(@Query() query: QueryTelemetryDto) { return this.observability.listHealth(query); }

  @Post('health')
  @RequirePermissions(Permissions.TelemetryWrite)
  recordHealth(@Body() body: RecordHealthDto) { return this.observability.recordHealth(body); }

  @Get('logs')
  @RequirePermissions(Permissions.TelemetryRead)
  logs(@Query() query: QueryTelemetryDto) { return this.observability.listLogs(query); }

  @Post('logs')
  @RequirePermissions(Permissions.TelemetryWrite)
  recordLog(@Body() body: RecordLogDto) { return this.observability.recordLog(body); }

  @Get('traces')
  @RequirePermissions(Permissions.TelemetryRead)
  traces(@Query() query: QueryTelemetryDto) { return this.observability.listTraces(query); }

  @Post('traces')
  @RequirePermissions(Permissions.TelemetryWrite)
  recordTrace(@Body() body: RecordTraceDto) { return this.observability.recordTrace(body); }

  @Get('alert-rules')
  @RequirePermissions(Permissions.AlertsRead)
  alertRules() { return this.observability.listAlertRules(); }

  @Post('alert-rules')
  @RequirePermissions(Permissions.AlertsManage)
  createAlertRule(@Body() body: CreateAlertRuleDto) { return this.observability.createAlertRule(body); }

  @Patch('alert-rules/:id')
  @RequirePermissions(Permissions.AlertsManage)
  updateAlertRule(@Param('id') id: string, @Body() body: UpdateAlertRuleDto) {
    return this.observability.updateAlertRule(id, body);
  }

  @Get('alerts')
  @RequirePermissions(Permissions.AlertsRead)
  alerts() { return this.observability.listAlerts(); }

  @Patch('alerts/:id/transition')
  @RequirePermissions(Permissions.AlertsManage)
  transitionAlert(@Param('id') id: string, @Body() body: TransitionAlertDto) {
    return this.observability.transitionAlert(id, body);
  }
}
