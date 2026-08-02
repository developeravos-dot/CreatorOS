import type {
  EnterpriseDashboard,
} from "../../../enterprise-api";

import {
  ensureIsoTimestamp,
  formatRelativeTime,
} from "./dashboard-relative-time";

import type {
  DashboardLiveActivity,
} from "../command-center/dashboard-command-center-types";

function activityTimestamp(
  createdAt: string | undefined,
  updatedAt: string | undefined,
): string {
  return ensureIsoTimestamp(
    updatedAt ??
      createdAt,
  );
}

export function buildDashboardLiveActivities(
  dashboard:
    EnterpriseDashboard,
  now = new Date(),
): DashboardLiveActivity[] {
  const projects =
    dashboard.projects.map(
      (project) => {
        const timestamp =
          activityTimestamp(
            project.createdAt,
            project.updatedAt,
          );

        return {
          id:
            `project-${project.id}`,

          category:
            "project" as const,

          title:
            project.name,

          description:
            `${project.platform} project is ${project.status}.`,

          timestamp,

          relativeTime:
            formatRelativeTime(
              timestamp,
              now,
            ),

          tone:
            project.status === "active"
              ? "success" as const
              : project.status === "paused"
                ? "warning" as const
                : "neutral" as const,

          entityId:
            project.id,
        };
      },
    );

  const scripts =
    dashboard.scripts.map(
      (script) => {
        const timestamp =
          activityTimestamp(
            script.createdAt,
            script.updatedAt,
          );

        return {
          id:
            `script-${script.id}`,

          category:
            "script" as const,

          title:
            script.title,

          description:
            `Script status changed to ${script.status}.`,

          timestamp,

          relativeTime:
            formatRelativeTime(
              timestamp,
              now,
            ),

          tone:
            script.status === "approved"
              ? "success" as const
              : script.status === "draft"
                ? "info" as const
                : "warning" as const,

          entityId:
            script.id,
        };
      },
    );

  const calendar =
    dashboard.calendar.map(
      (item) => {
        const timestamp =
          ensureIsoTimestamp(
            item.createdAt ??
              item.scheduledAt,
          );

        return {
          id:
            `calendar-${item.id}`,

          category:
            "calendar" as const,

          title:
            item.title,

          description:
            `Publishing item is ${item.status}.`,

          timestamp,

          relativeTime:
            formatRelativeTime(
              timestamp,
              now,
            ),

          tone:
            item.status === "published"
              ? "success" as const
              : item.status === "scheduled"
                ? "info" as const
                : "warning" as const,

          entityId:
            item.id,
        };
      },
    );

  const prompts =
    dashboard.prompts.map(
      (prompt) => {
        const timestamp =
          activityTimestamp(
            prompt.createdAt,
            prompt.updatedAt,
          );

        return {
          id:
            `prompt-${prompt.id}`,

          category:
            "prompt" as const,

          title:
            prompt.name,

          description:
            `Reusable prompt available for ${prompt.purpose}.`,

          timestamp,

          relativeTime:
            formatRelativeTime(
              timestamp,
              now,
            ),

          tone:
            "info" as const,

          entityId:
            prompt.id,
        };
      },
    );

  return [
    ...projects,
    ...scripts,
    ...calendar,
    ...prompts,
  ]
    .sort(
      (left, right) =>
        new Date(
          right.timestamp,
        ).getTime() -
        new Date(
          left.timestamp,
        ).getTime(),
    )
    .slice(
      0,
      12,
    );
}
