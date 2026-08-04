export type ControlPlaneComponentState =
  | 'online'
  | 'degraded'
  | 'offline'
  | 'maintenance';

export interface ControlPlaneComponent {
  readonly componentId: string;
  readonly displayName: string;
  readonly state:
    ControlPlaneComponentState;
  readonly activeWorkloads: number;
  readonly capacity: number;
  readonly updatedAt: Date;
}

export interface ControlPlaneCommand {
  readonly commandId: string;
  readonly type:
    | 'enable-maintenance'
    | 'disable-maintenance'
    | 'drain'
    | 'resume'
    | 'rebalance';
  readonly componentId: string;
  readonly requestedBy: string;
  readonly requestedAt: Date;
}

export interface ControlPlaneSnapshot {
  readonly status:
    | 'operational'
    | 'degraded'
    | 'critical';
  readonly totalComponents: number;
  readonly onlineComponents: number;
  readonly activeWorkloads: number;
  readonly totalCapacity: number;
  readonly utilization: number;
  readonly components:
    readonly ControlPlaneComponent[];
  readonly generatedAt: Date;
}
