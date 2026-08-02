function resourceKey(
  resource: string,
  identifier?: string,
): string {
  return identifier
    ? `${resource}.${identifier}`
    : resource;
}

export const apiQueryKeys = {
  enterprise: "enterprise",

  enterpriseDashboard:
    "enterprise.dashboard",

  enterpriseHealth:
    "enterprise.health",

  projects: "enterprise.projects",

  project(
    id: string,
  ) {
    return resourceKey(
      "enterprise.projects",
      id,
    );
  },

  scripts: "enterprise.scripts",

  script(
    id: string,
  ) {
    return resourceKey(
      "enterprise.scripts",
      id,
    );
  },

  calendar: "enterprise.calendar",

  calendarItem(
    id: string,
  ) {
    return resourceKey(
      "enterprise.calendar",
      id,
    );
  },

  prompts: "enterprise.prompts",

  aiContent:
    "enterprise.ai-content",

  aiStudioRuntime:
    "enterprise.ai-studio.runtime",

  aiStudioExecutionHistory:
    "enterprise.ai-studio.runtime.execution-history",

  aiOrganizationPersistence:
    "enterprise.ai-organization.persistence",
} as const;

export type StaticApiQueryKey =
  Exclude<
    (typeof apiQueryKeys)[keyof typeof apiQueryKeys],
    (...args: never[]) => string
  >;
