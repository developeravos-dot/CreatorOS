import type {
  EnterpriseIntelligenceSnapshot,
  IntelligenceActivity,
} from "./enterprise-intelligence-types";

import type {
  IntelligenceNotification,
  IntelligenceNotificationSummary,
} from "./enterprise-notification-types";

function activityMessage(
  activity: IntelligenceActivity,
): string {
  return activity.description;
}

export function buildIntelligenceNotifications(
  intelligence: EnterpriseIntelligenceSnapshot,
): IntelligenceNotification[] {
  const activityNotifications =
    intelligence.activities.map(
      (activity) => ({
        id: `notification-${activity.id}`,
        category: activity.category,
        title: activity.title,
        message:
          activityMessage(activity),
        timestamp:
          activity.timestamp,
        severity:
          activity.severity,
        read: false,
      }),
    );

  const healthNotifications =
    intelligence.health.items
      .filter(
        (item) => !item.healthy,
      )
      .map(
        (item) => ({
          id: `notification-health-${item.id}`,
          category:
            "system" as const,
          title:
            `${item.label} requires attention`,
          message:
            `System status: ${item.status}`,
          timestamp:
            intelligence.generatedAt,
          severity:
            intelligence.health.status ===
            "critical"
              ? "critical" as const
              : "warning" as const,
          read: false,
        }),
      );

  return [
    ...healthNotifications,
    ...activityNotifications,
  ].sort(
    (left, right) =>
      new Date(
        right.timestamp,
      ).getTime() -
      new Date(
        left.timestamp,
      ).getTime(),
  );
}

export function summarizeNotifications(
  notifications: IntelligenceNotification[],
): IntelligenceNotificationSummary {
  return notifications.reduce<
    IntelligenceNotificationSummary
  >(
    (summary, notification) => {
      summary.total += 1;

      if (!notification.read) {
        summary.unread += 1;
      }

      summary[
        notification.severity
      ] += 1;

      return summary;
    },
    {
      total: 0,
      unread: 0,
      info: 0,
      success: 0,
      warning: 0,
      critical: 0,
    },
  );
}
