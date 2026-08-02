export const apiQueryKeys = {
  enterpriseDashboard: "enterprise.dashboard",
  enterpriseHealth: "enterprise.health",
  aiStudioRuntime: "enterprise.ai-studio.runtime",
  aiOrganizationPersistence:
    "enterprise.ai-organization.persistence",
} as const;

export type ApiQueryKey =
  (typeof apiQueryKeys)[keyof typeof apiQueryKeys];
