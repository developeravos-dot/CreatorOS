import {
  projectsApi,
} from "../../api/services/projects";

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
  EnterpriseProject,
} from "../../enterprise-api";

export async function loadProjects(
  force = false,
): Promise<EnterpriseProject[]> {
  return queryClient.fetch(
    apiQueryKeys.projects,
    () => projectsApi.list(),
    {
      staleTime:
        queryPolicies.workspace.staleTime,
      force,
    },
  );
}

export function getCachedProjects() {
  return queryClient.getQueryData<
    EnterpriseProject[]
  >(apiQueryKeys.projects);
}

export function invalidateProjects() {
  queryClient.invalidate(
    apiQueryKeys.projects,
  );
}

export function updateCachedProject(
  project: EnterpriseProject,
) {
  queryClient.setQueryData(
    apiQueryKeys.projects,
    (
      current:
        | EnterpriseProject[]
        | undefined,
    ) => {
      if (!current) {
        return [project];
      }

      return current.map((item) =>
        item.id === project.id
          ? project
          : item,
      );
    },
  );
}
