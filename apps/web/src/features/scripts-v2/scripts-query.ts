import {
  scriptsApi,
} from "../../api/services/scripts";

import {
  queryClient,
} from "../../api/data-engine/QueryClient";

import {
  apiQueryKeys,
} from "../../api/data-engine/queryKeys";

import {
  queryPolicies,
} from "../../api/data-engine/queryPolicies";

import type {
  EnterpriseScript,
} from "../../enterprise-api";

export async function loadScripts(
  force = false,
): Promise<EnterpriseScript[]> {
  return queryClient.fetch(
    apiQueryKeys.scripts,
    () => scriptsApi.list(),
    {
      staleTime:
        queryPolicies.workspace.staleTime,
      force,
    },
  );
}

export function getCachedScripts():
  | EnterpriseScript[]
  | undefined {
  return queryClient.getQueryData<
    EnterpriseScript[]
  >(apiQueryKeys.scripts);
}

export function invalidateScripts(): void {
  queryClient.invalidate(
    apiQueryKeys.scripts,
  );
}

export function updateCachedScript(
  script: EnterpriseScript,
): void {
  queryClient.setQueryData(
    apiQueryKeys.scripts,
    (
      current:
        | EnterpriseScript[]
        | undefined,
    ) => {
      if (!current) {
        return [script];
      }

      const exists = current.some(
        (item) => item.id === script.id,
      );

      if (!exists) {
        return [
          script,
          ...current,
        ];
      }

      return current.map((item) =>
        item.id === script.id
          ? script
          : item,
      );
    },
  );
}
