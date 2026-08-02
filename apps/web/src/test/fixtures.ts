import type {
  EnterpriseDashboard,
} from "../enterprise-api";

export function createDashboardFixture(
  overrides: Partial<
    EnterpriseDashboard
  > = {},
): EnterpriseDashboard {
  return {
    projects: [],
    scripts: [],
    calendar: [],
    prompts: [],

    metrics: {
      projects: 0,
      activeProjects: 0,
      scripts: 0,
      scheduledContent: 0,
      prompts: 0,
    },

    system: {
      projectEngine:
        "operational",
      scriptEngine:
        "operational",
      calendarEngine:
        "operational",
      promptEngine:
        "operational",
      storage:
        "persistent",
    },

    ...overrides,
  };
}
