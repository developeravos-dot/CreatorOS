import type {
  EnterpriseCalendarItem,
  EnterpriseDashboard,
  EnterpriseProject,
  EnterpriseScript,
} from "../../enterprise-api";

import type {
  EnterpriseIntelligenceSnapshot,
  IntelligenceActivity,
  IntelligenceForecast,
  IntelligenceHealthItem,
  IntelligenceKpi,
  IntelligenceSeverity,
} from "./enterprise-intelligence-types";


import {
  buildRevenueIntelligence,
} from "./enterprise-revenue-engine";
function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    maximum,
    Math.max(minimum, value),
  );
}

function normalizeStatus(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase();
}

function isOperational(
  value: string,
): boolean {
  const status =
    normalizeStatus(value);

  return (
    status.includes("operational") ||
    status.includes("active") ||
    status.includes("ready") ||
    status.includes("connected") ||
    status.includes("persistent") ||
    status.includes("database") ||
    status.includes("storage")
  );
}

function getTimestamp(
  value: unknown,
): string {
  if (
    typeof value === "string" &&
    value.trim()
  ) {
    const parsed =
      new Date(value);

    if (
      !Number.isNaN(
        parsed.getTime(),
      )
    ) {
      return parsed.toISOString();
    }
  }

  return new Date().toISOString();
}

function readTimestamp(
  record: unknown,
): string {
  if (
    typeof record !== "object" ||
    record === null
  ) {
    return new Date().toISOString();
  }

  const candidate =
    record as Record<
      string,
      unknown
    >;

  return getTimestamp(
    candidate.updatedAt ??
      candidate.createdAt ??
      candidate.scheduledAt,
  );
}

function activitySeverity(
  status: string,
): IntelligenceSeverity {
  const normalized =
    normalizeStatus(status);

  if (
    normalized.includes("error") ||
    normalized.includes("failed") ||
    normalized.includes("blocked")
  ) {
    return "critical";
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("draft") ||
    normalized.includes("review")
  ) {
    return "warning";
  }

  if (
    normalized.includes("active") ||
    normalized.includes("completed") ||
    normalized.includes("published") ||
    normalized.includes("approved")
  ) {
    return "success";
  }

  return "info";
}

function projectActivities(
  projects: EnterpriseProject[],
): IntelligenceActivity[] {
  return projects.map(
    (project) => ({
      id: `project-${project.id}`,
      category: "project",
      title: project.name,
      description:
        `Project status: ${project.status}`,
      timestamp:
        readTimestamp(project),
      severity:
        activitySeverity(
          project.status,
        ),
    }),
  );
}

function scriptActivities(
  scripts: EnterpriseScript[],
): IntelligenceActivity[] {
  return scripts.map(
    (script) => ({
      id: `script-${script.id}`,
      category: "script",
      title: script.title,
      description:
        `Script status: ${script.status}`,
      timestamp:
        readTimestamp(script),
      severity:
        activitySeverity(
          script.status,
        ),
    }),
  );
}

function calendarActivities(
  items: EnterpriseCalendarItem[],
): IntelligenceActivity[] {
  return items.map(
    (item) => ({
      id: `calendar-${item.id}`,
      category: "calendar",
      title: item.title,
      description:
        `Scheduled for ${item.platform}`,
      timestamp:
        readTimestamp(item),
      severity: "info",
    }),
  );
}

function createHealthItems(
  dashboard: EnterpriseDashboard,
): IntelligenceHealthItem[] {
  return Object.entries(
    dashboard.system,
  ).map(
    ([id, status]) => {
      const healthy =
        isOperational(status);

      return {
        id,
        label: id,
        status,
        healthy,
        score: healthy
          ? 100
          : 25,
      };
    },
  );
}

function createKpis(
  dashboard: EnterpriseDashboard,
  healthScore: number,
): IntelligenceKpi[] {
  const projectTotal =
    dashboard.metrics.projects;

  const activeProjects =
    dashboard.metrics.activeProjects;

  const scripts =
    dashboard.metrics.scripts;

  const scheduled =
    dashboard.metrics.scheduledContent;

  const prompts =
    dashboard.metrics.prompts;

  const activationRate =
    projectTotal > 0
      ? Math.round(
          (
            activeProjects /
            projectTotal
          ) * 100,
        )
      : 0;

  const scriptsPerProject =
    projectTotal > 0
      ? scripts / projectTotal
      : 0;

  const schedulingRate =
    scripts > 0
      ? Math.round(
          (
            scheduled /
            scripts
          ) * 100,
        )
      : 0;

  return [
    {
      id: "activation-rate",
      label: "Project activation",
      value: activationRate,
      formattedValue:
        `${activationRate}%`,
      description:
        "Share of projects currently active.",
      trend:
        activationRate >= 50
          ? "up"
          : activationRate > 0
            ? "stable"
            : "down",
      trendValue:
        activationRate,
      severity:
        activationRate >= 70
          ? "success"
          : activationRate >= 35
            ? "warning"
            : "critical",
    },

    {
      id: "scripts-per-project",
      label: "Scripts per project",
      value: scriptsPerProject,
      formattedValue:
        scriptsPerProject.toFixed(1),
      description:
        "Average script production density.",
      trend:
        scriptsPerProject >= 1
          ? "up"
          : "stable",
      trendValue:
        Math.round(
          scriptsPerProject * 100,
        ),
      severity:
        scriptsPerProject >= 1
          ? "success"
          : "warning",
    },

    {
      id: "scheduling-rate",
      label: "Scheduling coverage",
      value: schedulingRate,
      formattedValue:
        `${schedulingRate}%`,
      description:
        "Scheduled content compared with scripts.",
      trend:
        schedulingRate >= 50
          ? "up"
          : schedulingRate > 0
            ? "stable"
            : "down",
      trendValue:
        schedulingRate,
      severity:
        schedulingRate >= 70
          ? "success"
          : schedulingRate >= 30
            ? "warning"
            : "critical",
    },

    {
      id: "prompt-leverage",
      label: "Prompt leverage",
      value: prompts,
      formattedValue:
        String(prompts),
      description:
        "Reusable AI prompt assets.",
      trend:
        prompts > 0
          ? "up"
          : "stable",
      trendValue: prompts,
      severity:
        prompts > 0
          ? "success"
          : "info",
    },

    {
      id: "system-health",
      label: "System health",
      value: healthScore,
      formattedValue:
        `${healthScore}%`,
      description:
        "Operational health across system engines.",
      trend:
        healthScore >= 80
          ? "up"
          : healthScore >= 50
            ? "stable"
            : "down",
      trendValue:
        healthScore,
      severity:
        healthScore >= 80
          ? "success"
          : healthScore >= 50
            ? "warning"
            : "critical",
    },
  ];
}

function createForecasts(
  dashboard: EnterpriseDashboard,
): IntelligenceForecast[] {
  const projects =
    dashboard.metrics.projects;

  const scripts =
    dashboard.metrics.scripts;

  const scheduled =
    dashboard.metrics.scheduledContent;

  const projectGrowth =
    projects === 0
      ? 1
      : Math.max(
          1,
          Math.ceil(projects * 0.15),
        );

  const scriptGrowth =
    scripts === 0
      ? Math.max(1, projects)
      : Math.max(
          1,
          Math.ceil(scripts * 0.2),
        );

  const scheduleGrowth =
    scheduled === 0
      ? Math.max(
          1,
          Math.ceil(
            scripts * 0.25,
          ),
        )
      : Math.max(
          1,
          Math.ceil(
            scheduled * 0.15,
          ),
        );

  return [
    {
      id: "projects-forecast",
      label: "Projected projects",
      currentValue: projects,
      predictedValue:
        projects + projectGrowth,
      confidence:
        projects > 0 ? 65 : 35,
      explanation:
        "Heuristic projection based on the current project base.",
    },

    {
      id: "scripts-forecast",
      label: "Projected scripts",
      currentValue: scripts,
      predictedValue:
        scripts + scriptGrowth,
      confidence:
        scripts > 0 ? 70 : 40,
      explanation:
        "Heuristic projection based on current production density.",
    },

    {
      id: "scheduled-forecast",
      label: "Projected scheduled content",
      currentValue: scheduled,
      predictedValue:
        scheduled +
        scheduleGrowth,
      confidence:
        scheduled > 0
          ? 68
          : 38,
      explanation:
        "Heuristic projection based on script and scheduling volume.",
    },
  ];
}

export function buildEnterpriseIntelligence(
  dashboard: EnterpriseDashboard,
): EnterpriseIntelligenceSnapshot {
  const healthItems =
    createHealthItems(dashboard);

  const healthyCount =
    healthItems.filter(
      (item) => item.healthy,
    ).length;

  const healthScore =
    healthItems.length > 0
      ? Math.round(
          (
            healthyCount /
            healthItems.length
          ) * 100,
        )
      : 0;

  const activities = [
    ...projectActivities(
      dashboard.projects,
    ),

    ...scriptActivities(
      dashboard.scripts,
    ),

    ...calendarActivities(
      dashboard.calendar,
    ),
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
    .slice(0, 20);

  return {
    generatedAt:
      new Date().toISOString(),

    kpis:
      createKpis(
        dashboard,
        healthScore,
      ),

    activities,

    health: {
      score:
        clamp(
          healthScore,
          0,
          100,
        ),

      status:
        healthScore >= 80
          ? "healthy"
          : healthScore >= 50
            ? "attention"
            : "critical",

      items: healthItems,
    },

    forecasts:
      createForecasts(
        dashboard,
      ),

    revenue:
      buildRevenueIntelligence(
        dashboard,
      ),

    distribution: {
      projects:
        dashboard.metrics.projects,

      activeProjects:
        dashboard.metrics.activeProjects,

      scripts:
        dashboard.metrics.scripts,

      scheduledContent:
        dashboard.metrics.scheduledContent,

      prompts:
        dashboard.metrics.prompts,
    },
  };
}
