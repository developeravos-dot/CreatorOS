export type EnterprisePlatform = "YouTube" | "TikTok" | "Both";
export type ProjectStatus = "planning" | "active" | "paused" | "completed";
export type ScriptStatus = "draft" | "review" | "approved" | "production";

export interface EnterpriseProject {
  id: string;
  name: string;
  description: string;
  platform: EnterprisePlatform;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseScript {
  id: string;
  projectId: string;
  title: string;
  content: string;
  status: ScriptStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseCalendarItem {
  id: string;
  projectId: string;
  title: string;
  scheduledAt: string;
  platform: EnterprisePlatform;
  status: "scheduled" | "published" | "cancelled";
  createdAt: string;
}

export interface EnterprisePrompt {
  id: string;
  name: string;
  purpose: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseDashboard {
  projects: EnterpriseProject[];
  scripts: EnterpriseScript[];
  calendar: EnterpriseCalendarItem[];
  prompts: EnterprisePrompt[];
  metrics: {
    projects: number;
    activeProjects: number;
    scripts: number;
    scheduledContent: number;
    prompts: number;
  };
  system: {
    projectEngine: string;
    scriptEngine: string;
    calendarEngine: string;
    promptEngine: string;
    storage: string;
  };
}

const API_BASE = "/api/v1/enterprise";

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(
      `استجابة غير صالحة من الخادم: ${text.slice(0, 120)}`,
    );
  }

  const data = await response.json();

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join("، ")
      : data?.message;

    throw new Error(
      message ?? `فشل الطلب برمز ${response.status}`,
    );
  }

  return data as T;
}

export const enterpriseApi = {
  health() {
    return request<{
      success: boolean;
      status: string;
    }>("/health");
  },

  dashboard() {
    return request<EnterpriseDashboard>("/dashboard");
  },

  createProject(input: {
    name: string;
    description: string;
    platform: EnterprisePlatform;
  }) {
    return request<EnterpriseProject>("/projects", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  updateProjectStatus(
    id: string,
    status: ProjectStatus,
  ) {
    return request<EnterpriseProject>(
      `/projects/${encodeURIComponent(id)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
    );
  },

  deleteProject(id: string) {
    return request<{
      success: boolean;
      deletedProjectId: string;
    }>(`/projects/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },

  createScript(input: {
    projectId: string;
    title: string;
    content: string;
  }) {
    return request<EnterpriseScript>("/scripts", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  updateScript(
    id: string,
    input: {
      title?: string;
      content?: string;
      status?: ScriptStatus;
    },
  ) {
    return request<EnterpriseScript>(
      `/scripts/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(input),
      },
    );
  },

  scheduleContent(input: {
    projectId: string;
    title: string;
    scheduledAt: string;
    platform: EnterprisePlatform;
  }) {
    return request<EnterpriseCalendarItem>("/calendar", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  createPrompt(input: {
    name: string;
    purpose: string;
    prompt: string;
  }) {
    return request<EnterprisePrompt>("/prompts", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
};