import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DashboardWidget } from '../extension-operations.types';
import { PluginMarketplaceService } from '../plugins/plugin-marketplace.service';
import { DeploymentOperationsService } from '../operations/deployment-operations.service';

@Injectable()
export class EnterpriseDashboardService {
  private readonly widgets = new Map<
    string,
    DashboardWidget
  >();

  constructor(
    private readonly plugins:
      PluginMarketplaceService,
    private readonly operations:
      DeploymentOperationsService,
  ) {}

  upsertWidget(input: {
    key: string;
    title: string;
    category: DashboardWidget['category'];
    value: DashboardWidget['value'];
    status: DashboardWidget['status'];
  }) {
    const current = this.widgets.get(input.key);

    const widget: DashboardWidget = {
      id: current?.id ?? randomUUID(),
      ...input,
      updatedAt: new Date().toISOString(),
    };

    this.widgets.set(widget.key, widget);
    return widget;
  }

  refresh() {
    const pluginSummary =
      this.plugins.summary();

    const operationSummary =
      this.operations.summary();

    this.upsertWidget({
      key: 'plugins-total',
      title: 'Plugins',
      category: 'extensions',
      value: pluginSummary.total,
      status: 'normal',
    });

    this.upsertWidget({
      key: 'plugins-enabled',
      title: 'Enabled Plugins',
      category: 'extensions',
      value: pluginSummary.enabled,
      status:
        pluginSummary.failed > 0
          ? 'warning'
          : 'normal',
    });

    this.upsertWidget({
      key: 'deployments-total',
      title: 'Deployments',
      category: 'operations',
      value: operationSummary.deployments,
      status: 'normal',
    });

    this.upsertWidget({
      key: 'deployments-failed',
      title: 'Failed Deployments',
      category: 'operations',
      value: operationSummary.failed,
      status:
        operationSummary.failed > 0
          ? 'critical'
          : 'normal',
    });

    this.upsertWidget({
      key: 'operations-health',
      title: 'Operations Health',
      category: 'operations',
      value:
        operationSummary.failed > 0
          ? 'degraded'
          : 'healthy',
      status:
        operationSummary.failed > 0
          ? 'warning'
          : 'normal',
    });

    return this.snapshot();
  }

  snapshot() {
    const widgets = [...this.widgets.values()];

    return {
      status: widgets.some(
        (widget) => widget.status === 'critical',
      )
        ? 'critical'
        : widgets.some(
              (widget) =>
                widget.status === 'warning',
            )
          ? 'warning'
          : 'healthy',
      widgets,
      totals: {
        widgets: widgets.length,
        extensionWidgets: widgets.filter(
          (item) =>
            item.category === 'extensions',
        ).length,
        operationsWidgets: widgets.filter(
          (item) =>
            item.category === 'operations',
        ).length,
      },
      generatedAt: new Date().toISOString(),
    };
  }
}