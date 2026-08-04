import {
  Injectable,
} from '@nestjs/common';

import {
  EnterpriseControlPlaneService,
} from './enterprise-control-plane.service';

export interface OperationsConsoleAlert {
  readonly alertId: string;
  readonly severity:
    | 'info'
    | 'warning'
    | 'critical';
  readonly title: string;
  readonly componentId: string | null;
  readonly acknowledged: boolean;
  readonly createdAt: Date;
}

export interface OperationsConsoleSnapshot {
  readonly platformStatus:
    | 'operational'
    | 'degraded'
    | 'critical';
  readonly activeAlerts: number;
  readonly criticalAlerts: number;
  readonly commandCount: number;
  readonly utilization: number;
  readonly maintenanceComponents:
    readonly string[];
  readonly generatedAt: Date;
}

@Injectable()
export class EnterpriseOperationsConsoleService {
  private readonly alerts =
    new Map<
      string,
      OperationsConsoleAlert
    >();

  constructor(
    private readonly controlPlane:
      EnterpriseControlPlaneService =
        new EnterpriseControlPlaneService(),
  ) {}

  raiseAlert(input: {
    readonly alertId: string;
    readonly severity:
      | 'info'
      | 'warning'
      | 'critical';
    readonly title: string;
    readonly componentId?: string | null;
    readonly now?: Date;
  }): OperationsConsoleAlert {
    const alertId =
      input.alertId.trim();

    const title =
      input.title.trim();

    if (
      !alertId ||
      !title ||
      this.alerts.has(alertId)
    ) {
      throw new Error(
        'A unique alert id and title are required.',
      );
    }

    const alert:
      OperationsConsoleAlert = {
        alertId,
        severity: input.severity,
        title,
        componentId:
          input.componentId?.trim() ??
          null,
        acknowledged: false,
        createdAt: new Date(
          input.now ?? new Date(),
        ),
      };

    this.alerts.set(
      alertId,
      alert,
    );

    return this.cloneAlert(alert);
  }

  acknowledge(
    alertId: string,
  ): OperationsConsoleAlert {
    const current =
      this.alerts.get(
        alertId.trim(),
      );

    if (!current) {
      throw new Error(
        `Alert ${alertId} was not found.`,
      );
    }

    const updated:
      OperationsConsoleAlert = {
        ...current,
        acknowledged: true,
      };

    this.alerts.set(
      alertId,
      updated,
    );

    return this.cloneAlert(
      updated,
    );
  }

  listAlerts(
    includeAcknowledged = false,
  ): readonly OperationsConsoleAlert[] {
    return [...this.alerts.values()]
      .filter(
        (alert) =>
          includeAcknowledged ||
          !alert.acknowledged,
      )
      .sort(
        (left, right) =>
          right.createdAt.getTime() -
          left.createdAt.getTime(),
      )
      .map((alert) =>
        this.cloneAlert(alert),
      );
  }

  snapshot():
    OperationsConsoleSnapshot {
    const controlPlane =
      this.controlPlane.snapshot();

    const activeAlerts =
      this.listAlerts(false);

    return {
      platformStatus:
        activeAlerts.some(
          (alert) =>
            alert.severity ===
            'critical',
        )
          ? 'critical'
          : controlPlane.status,
      activeAlerts:
        activeAlerts.length,
      criticalAlerts:
        activeAlerts.filter(
          (alert) =>
            alert.severity ===
            'critical',
        ).length,
      commandCount:
        this.controlPlane
          .listCommands()
          .length,
      utilization:
        controlPlane.utilization,
      maintenanceComponents:
        controlPlane.components
          .filter(
            (component) =>
              component.state ===
              'maintenance',
          )
          .map(
            (component) =>
              component.componentId,
          ),
      generatedAt: new Date(),
    };
  }

  private cloneAlert(
    alert: OperationsConsoleAlert,
  ): OperationsConsoleAlert {
    return {
      ...alert,
      createdAt: new Date(
        alert.createdAt,
      ),
    };
  }
}
