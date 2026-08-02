import { enterpriseClient } from "../core/client";
import type {
  EnterpriseScript,
  ScriptStatus,
} from "../../enterprise-api";

export interface CreateScriptInput {
  projectId: string;
  title: string;
  content: string;
}

export interface UpdateScriptInput {
  title?: string;
  content?: string;
  status?: ScriptStatus;
}

export const scriptsApi = {
  list() {
    return enterpriseClient.get<EnterpriseScript[]>(
      "/scripts",
    );
  },
create(input: CreateScriptInput) {
    return enterpriseClient.post<EnterpriseScript>(
      "/scripts",
      input,
    );
  },

  update(
    id: string,
    input: UpdateScriptInput,
  ) {
    return enterpriseClient.patch<EnterpriseScript>(
      `/scripts/${encodeURIComponent(id)}`,
      input,
    );
  },
};
