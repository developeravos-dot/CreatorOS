import {
  enterpriseClient,
} from "../../api/core/client";
import type {
  AIOrganizationState,
} from "./ai-organization-types";

export interface AIOrganizationWorkspaceRecord {
  id: string;
  workspaceKey: string;
  projectId: string | null;
  version: number;
  state: AIOrganizationState;
  createdAt: string;
  updatedAt: string;
}

export interface SaveAIOrganizationWorkspaceInput {
  projectId?: string | null;
  expectedVersion?: number;
  state: AIOrganizationState;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  let body: unknown = undefined;

  if (
    typeof init.body === "string" &&
    init.body.trim()
  ) {
    try {
      body = JSON.parse(init.body);
    } catch {
      body = init.body;
    }
  }

  return enterpriseClient.request<T>(
    `/ai-organization/persistence${path}`,
    {
      ...init,
      body,
    },
  );
}

export async function loadAIOrganizationWorkspace(
  workspaceKey: string,
): Promise<AIOrganizationWorkspaceRecord | null> {
  return request<AIOrganizationWorkspaceRecord | null>(
    `/workspaces/${encodeURIComponent(workspaceKey)}`,
  );
}

export async function saveAIOrganizationWorkspace(
  workspaceKey: string,
  input: SaveAIOrganizationWorkspaceInput,
): Promise<AIOrganizationWorkspaceRecord> {
  return request<AIOrganizationWorkspaceRecord>(
    `/workspaces/${encodeURIComponent(workspaceKey)}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteAIOrganizationWorkspace(
  workspaceKey: string,
): Promise<{
  deleted: true;
  workspaceKey: string;
}> {
  return request(
    `/workspaces/${encodeURIComponent(workspaceKey)}`,
    {
      method: "DELETE",
    },
  );
}
