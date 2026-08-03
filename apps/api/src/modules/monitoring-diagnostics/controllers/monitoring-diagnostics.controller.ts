import {
  Controller,
  Get,
  ServiceUnavailableException,
} from '@nestjs/common';

import {
  DiagnosticsService,
  MonitoringDiagnosticsService,
  MonitoringMetricsService,
} from '../services';

@Controller('monitoring')
export class MonitoringDiagnosticsController {
  constructor(
    private readonly monitoring:
      MonitoringDiagnosticsService,
    private readonly diagnostics:
      DiagnosticsService,
    private readonly metrics:
      MonitoringMetricsService,
  ) {}

  @Get('liveness')
  liveness() {
    return this.monitoring
      .liveness();
  }

  @Get('readiness')
  async readiness() {
    const result =
      await this.monitoring
        .readiness();

    if (!result.ready) {
      throw new ServiceUnavailableException(
        result,
      );
    }

    return result;
  }

  @Get('health')
  async health() {
    const result =
      await this.monitoring
        .health();

    if (
      result.status ===
      'unhealthy'
    ) {
      throw new ServiceUnavailableException(
        result,
      );
    }

    return result;
  }

  @Get('diagnostics')
  diagnosticsSummary() {
    return this.diagnostics
      .getDiagnostics();
  }

  @Get('metrics')
  metricsSummary() {
    return this.metrics
      .getMetrics();
  }
}