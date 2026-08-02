import { enterpriseClient } from "../core/client";
import type {
  EnterprisePlatform,
  EnterpriseProject,
  ProjectStatus,
} from "../../enterprise-api";

export interface CreateProjectInput {
  name: string;
  description: string;
  platform: EnterprisePlatform;
}

export const projectsApi = {
  list() {
    return enterpriseClient.get<EnterpriseProject[]>(
      "/projects",
    );
  },
create(input: CreateProjectInput) {
    return enterpriseClient.post<EnterpriseProject>(
      "/projects",
      input,
    );
  },

  updateStatus(
    id: string,
    status: ProjectStatus,
  ) {
    return enterpriseClient.patch<EnterpriseProject>(
      `/projects/${encodeURIComponent(id)}/status`,
      { status },
    );
  },

  delete(id: string) {
    return enterpriseClient.delete<{
      success: boolean;
      deletedProjectId: string;
    }>(
      `/projects/${encodeURIComponent(id)}`,
    );
  },
};
