export const queryPolicies = {
  dashboard: {
    staleTime: 15_000,
  },

  health: {
    staleTime: 10_000,
  },

  workspace: {
    staleTime: 30_000,
  },

  runtime: {
    staleTime: 5_000,
  },

  persistence: {
    staleTime: 20_000,
  },
} as const;
