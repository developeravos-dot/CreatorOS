import {
  Injectable,
} from '@nestjs/common';

import {
  EnterpriseAlertEngineService,
} from './enterprise-alert-engine.service';
import {
  EnterpriseMetricsRegistryService,
} from './enterprise-metrics-registry.service';
import {
  EnterpriseNotificationRouterService,
} from './enterprise-notification-router.service';

@Injectable()
export class EnterpriseObservabilityOrchestratorService {
  constructor(
    private readonly metrics:
      EnterpriseMetricsRegistryService,
    private readonly alerts:
      EnterpriseAlertEngineService,
    private readonly notifications:
      EnterpriseNotificationRouterService,
  ) {}

  record(input: {
    readonly metric: string;
    readonly value: number;
    readonly labels?: Readonly<
      Record<string, string>
    >;
  }) {
    const metric =
      this.metrics.record(input);

    const alerts =
      this.alerts.evaluate({
        metric:
          metric.metric,
        value:
          metric.value,
        now:
          metric.recordedAt,
      });

    const notifications =
      alerts.map((alert) =>
        this.notifications.queue({
          notificationId:
            'notification:' +
            alert.alertId,
          channel: 'console',
          recipient:
            'enterprise-operations',
          subject:
            alert.severity +
            ' alert',
          body:
            alert.metric +
            '=' +
            alert.value,
          now:
            alert.openedAt,
        }),
      );

    return {
      metric,
      alerts,
      notifications,
    };
  }

  snapshot() {
    return {
      metrics:
        this.metrics.query(),
      alerts:
        this.alerts.list(),
      notifications:
        this.notifications.list(),
      generatedAt:
        new Date(),
    };
  }
}
