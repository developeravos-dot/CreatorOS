import type {
  IntelligenceActivity,
  IntelligenceSeverity,
} from "./enterprise-intelligence-types";

export type IntelligenceNotificationCategory =
  | "all"
  | IntelligenceActivity["category"];

export interface IntelligenceNotification {
  id: string;
  category: IntelligenceActivity["category"];
  title: string;
  message: string;
  timestamp: string;
  severity: IntelligenceSeverity;
  read: boolean;
}

export interface IntelligenceNotificationSummary {
  total: number;
  unread: number;
  info: number;
  success: number;
  warning: number;
  critical: number;
}
