import {
  Injectable,
} from '@nestjs/common';

export interface EnterpriseAlertRule {
  readonly ruleId: string;
  readonly metric: string;
  readonly operator:
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte';
  readonly threshold: number;
  readonly severity:
    | 'info'
    | 'warning'
    | 'critical';
  readonly enabled: boolean;
}

export interface EnterpriseAlert {
  readonly alertId: string;
  readonly ruleId: string;
  readonly metric: string;
  readonly value: number;
  readonly severity:
    EnterpriseAlertRule['severity'];
  readonly status:
    | 'open'
    | 'acknowledged'
    | 'resolved';
  readonly openedAt: Date;
  readonly resolvedAt: Date | null;
}

@Injectable()
export class EnterpriseAlertEngineService {
  private readonly rules =
    new Map<
      string,
      EnterpriseAlertRule
    >();

  private readonly alerts =
    new Map<
      string,
      EnterpriseAlert
    >();

  registerRule(
    rule: EnterpriseAlertRule,
  ): EnterpriseAlertRule {
    const ruleId =
      rule.ruleId.trim();

    if (
      !ruleId ||
      !rule.metric.trim() ||
      !Number.isFinite(
        rule.threshold,
      ) ||
      this.rules.has(ruleId)
    ) {
      throw new Error(
        'Valid unique alert rule is required.',
      );
    }

    const normalized = {
      ...rule,
      ruleId,
      metric:
        rule.metric.trim(),
    };

    this.rules.set(
      ruleId,
      normalized,
    );

    return { ...normalized };
  }

  evaluate(input: {
    readonly metric: string;
    readonly value: number;
    readonly now?: Date;
  }): readonly EnterpriseAlert[] {
    const matching =
      [...this.rules.values()]
        .filter(
          (rule) =>
            rule.enabled &&
            rule.metric ===
              input.metric.trim() &&
            this.matches(
              input.value,
              rule.operator,
              rule.threshold,
            ),
        );

    return matching.map(
      (rule) => {
        const alertId =
          rule.ruleId +
          ':' +
          input.metric.trim();

        const existing =
          this.alerts.get(
            alertId,
          );

        if (
          existing &&
          existing.status !==
            'resolved'
        ) {
          return this.clone(
            existing,
          );
        }

        const alert:
          EnterpriseAlert = {
            alertId,
            ruleId:
              rule.ruleId,
            metric:
              input.metric.trim(),
            value:
              input.value,
            severity:
              rule.severity,
            status: 'open',
            openedAt: new Date(
              input.now ??
                new Date(),
            ),
            resolvedAt: null,
          };

        this.alerts.set(
          alertId,
          alert,
        );

        return this.clone(alert);
      },
    );
  }

  acknowledge(
    alertId: string,
  ): EnterpriseAlert {
    const current =
      this.requireAlert(
        alertId,
      );

    const updated = {
      ...current,
      status:
        'acknowledged' as const,
    };

    this.alerts.set(
      alertId,
      updated,
    );

    return this.clone(updated);
  }

  resolve(
    alertId: string,
    now = new Date(),
  ): EnterpriseAlert {
    const current =
      this.requireAlert(
        alertId,
      );

    const updated = {
      ...current,
      status: 'resolved' as const,
      resolvedAt:
        new Date(now),
    };

    this.alerts.set(
      alertId,
      updated,
    );

    return this.clone(updated);
  }

  list():
    readonly EnterpriseAlert[] {
    return [...this.alerts.values()]
      .map((alert) =>
        this.clone(alert),
      );
  }

  private requireAlert(
    alertId: string,
  ): EnterpriseAlert {
    const alert =
      this.alerts.get(
        alertId.trim(),
      );

    if (!alert) {
      throw new Error(
        'Enterprise alert was not found.',
      );
    }

    return alert;
  }

  private matches(
    value: number,
    operator:
      EnterpriseAlertRule['operator'],
    threshold: number,
  ): boolean {
    switch (operator) {
      case 'gt':
        return value > threshold;
      case 'gte':
        return value >= threshold;
      case 'lt':
        return value < threshold;
      case 'lte':
        return value <= threshold;
    }
  }

  private clone(
    alert: EnterpriseAlert,
  ): EnterpriseAlert {
    return {
      ...alert,
      openedAt:
        new Date(
          alert.openedAt,
        ),
      resolvedAt:
        alert.resolvedAt
          ? new Date(
              alert.resolvedAt,
            )
          : null,
    };
  }
}
