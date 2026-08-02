import type {
  AIOrganizationState,
} from "./ai-organization-types";

const apiBase =
  "/api/v1/enterprise/ai-organization/persistence";

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
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${apiBase}${path}`,
    {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...init?.headers,
      },
    },
  );

  if (!response.ok) {
    const body = await response
      .json()
      .catch(() => null);

    const error = new Error(
      body?.message ??
        `AI Organization request failed: ${response.status}`,
    );

    Object.assign(error, {
      status: response.status,
      body,
    });

    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
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
