export type DashboardCommandTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export type DashboardActivityCategory =
  | "project"
  | "script"
  | "calendar"
  | "prompt"
  | "system";

export interface DashboardLiveActivity {
  id: string;
  category:
    DashboardActivityCategory;

  title: string;
  description: string;
  timestamp: string;
  relativeTime: string;
  tone: DashboardCommandTone;
  entityId?: string;
}

export interface DashboardQuickCommand {
  id: string;
  label: string;
  description: string;
  icon: string;
  tone: DashboardCommandTone;
  disabled?: boolean;
}

export type DashboardAlertSeverity =
  | "info"
  | "warning"
  | "critical";

export interface DashboardOperationalAlert {
  id: string;
  title: string;
  description: string;
  severity:
    DashboardAlertSeverity;

  actionLabel?: string;
  entityId?: string;
}

export interface DashboardCommandCenterSnapshot {
  generatedAt: string;

  activities:
    DashboardLiveActivity[];

  commands:
    DashboardQuickCommand[];

  alerts:
    DashboardOperationalAlert[];

  summary: {
    totalActivities: number;
    actionableAlerts: number;
    criticalAlerts: number;
    availableCommands: number;
  };
}
