import {
  Injectable,
} from '@nestjs/common';

import type {
  ComponentHealthResult,
  DiagnosticsSummary,
  MonitoringIssue,
  MonitoringRecommendation,
  MonitoringSeverity,
} from '../contracts';
import {
  MonitoringDiagnosticsService,
} from './monitoring-diagnostics.service';

@Injectable()
export class DiagnosticsService {
  constructor(
    private readonly monitoring:
      MonitoringDiagnosticsService,
  ) {}

  async getDiagnostics():
    Promise<DiagnosticsSummary> {
    const health =
      await this.monitoring.health();

    const issues =
      health.components
        .filter(
          (component) =>
            component.status !==
            'healthy',
        )
        .map(
          (component) =>
            this.createIssue(
              component,
            ),
        );

    const recommendations =
      issues.map(
        (issue) =>
          this.createRecommendation(
            issue,
          ),
      );

    return {
      status:
        health.status,
      issues,
      recommendations,
      generatedAt:
        new Date().toISOString(),
    };
  }

  private createIssue(
    component:
      ComponentHealthResult,
  ): MonitoringIssue {
    const severity =
      this.resolveSeverity(
        component,
      );

    return {
      code:
        this.issueCode(
          component,
        ),
      severity,
      component:
        component.component,
      message:
        component.message,
      evidence: {
        status:
          component.status,
        latencyMs:
          component.latencyMs,
        ...component.details,
      },
      detectedAt:
        new Date().toISOString(),
    };
  }

  private createRecommendation(
    issue:
      MonitoringIssue,
  ): MonitoringRecommendation {
    return {
      code:
        `RECOMMEND_${issue.code}`,
      severity:
        issue.severity,
      component:
        issue.component,
      action:
        this.recommendedAction(
          issue.component,
          issue.severity,
        ),
      reason:
        issue.message,
    };
  }

  private resolveSeverity(
    component:
      ComponentHealthResult,
  ): MonitoringSeverity {
    if (
      component.component ===
        'database' &&
      component.status ===
        'unhealthy'
    ) {
      return 'critical';
    }

    if (
      component.status ===
      'unhealthy'
    ) {
      return 'critical';
    }

    if (
      component.status ===
        'degraded' ||
      component.status ===
        'unknown'
    ) {
      return 'warning';
    }

    return 'info';
  }

  private issueCode(
    component:
      ComponentHealthResult,
  ): string {
    const normalized =
      component.component
        .replace(
          /[^a-zA-Z0-9]+/g,
          '_',
        )
        .toUpperCase();

    return `${normalized}_${component.status.toUpperCase()}`;
  }

  private recommendedAction(
    component: string,
    severity:
      MonitoringSeverity,
  ): string {
    switch (component) {
      case 'database':
        return severity ===
          'critical'
          ? 'Verify database connectivity and restore the persistence service.'
          : 'Review database latency and persistence health.';

      case 'capability-registry':
        return 'Inspect invalid capability records and correct their manifests or lifecycle state.';

      case 'capability-runtime':
        return 'Inspect failed runtime instances and restart or stop affected capabilities safely.';

      case 'dependency-resolver':
        return 'Verify dependency resolver availability and review capability dependency contracts.';

      case 'plugin-host':
        return 'Inspect failed plugins and review their installation, activation, and runtime state.';

      default:
        return 'Inspect the affected component and review recent operational events.';
    }
  }
}