import type {
  EnterpriseDashboard,
} from "../../enterprise-api";

import {
  queryClient,
} from "../../api/data-engine/QueryClient";

import {
  buildEnterpriseIntelligence,
} from "./enterprise-intelligence-engine";

import type {
  EnterpriseIntelligenceSnapshot,
} from "./enterprise-intelligence-types";

export const ENTERPRISE_INTELLIGENCE_QUERY_KEY =
  "enterprise.intelligence.snapshot";

export function loadEnterpriseIntelligence(
  dashboard: EnterpriseDashboard,
  force = false,
): Promise<EnterpriseIntelligenceSnapshot> {
  return queryClient.fetch(
    ENTERPRISE_INTELLIGENCE_QUERY_KEY,
    async () =>
      buildEnterpriseIntelligence(
        dashboard,
      ),
    {
      staleTime: 10_000,
      force,
    },
  );
}

export function getCachedEnterpriseIntelligence():
  | EnterpriseIntelligenceSnapshot
  | undefined {
  return queryClient.getQueryData<
    EnterpriseIntelligenceSnapshot
  >(
    ENTERPRISE_INTELLIGENCE_QUERY_KEY,
  );
}

export function invalidateEnterpriseIntelligence():
  void {
  queryClient.invalidate(
    ENTERPRISE_INTELLIGENCE_QUERY_KEY,
  );
}
