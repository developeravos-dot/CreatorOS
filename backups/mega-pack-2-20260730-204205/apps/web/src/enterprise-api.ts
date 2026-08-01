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

const API_BASE = (
  import.meta.env.VITE_ENTERPRISE_API_URL ||
  "http://localhost:3000/api/v1/enterprise"
).replace(/\/+$/, "");

export class EnterpriseApiError extends Error {
  readonly status: number;
  readonly url: string;
  readonly payload?: unknown;

  constructor(
    message: string,
    status: number,
    url: string,
    payload?: unknown,
  ) {
    super(message);
    this.name = "EnterpriseApiError";
    this.status = status;
    this.url = url;
    this.payload = payload;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function extractErrorMessage(
  payload: unknown,
  fallback: string,
): string {
  if (!isRecord(payload)) {
    return fallback;
  }

  const message = payload.message;

  if (Array.isArray(message)) {
    const validMessages = message.filter(
      (item): item is string => typeof item === "string",
    );

    if (validMessages.length > 0) {
      return validMessages.join("، ");
    }
  }

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (
    typeof payload.error === "string" &&
    payload.error.trim()
  ) {
    return payload.error;
  }

  return fallback;
}

function unwrapPayload<T>(payload: unknown): T {
  if (
    isRecord(payload) &&
    payload.success === false
  ) {
    throw new EnterpriseApiError(
      extractErrorMessage(
        payload,
        "أعاد الخادم استجابة غير ناجحة.",
      ),
      200,
      "response-validation",
      payload,
    );
  }

  /*
   * يدعم عقدين بصورة نظيفة:
   *
   * 1. استجابة مباشرة:
   *    { projects, scripts, calendar, ... }
   *
   * 2. استجابة مغلفة:
   *    { success: true, data: { ... } }
   */
  if (
    isRecord(payload) &&
    "data" in payload &&
    payload.data !== undefined
  ) {
    return payload.data as T;
  }

  return payload as T;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  const url = `${API_BASE}${normalizedPath}`;

  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    15000,
  );

  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(options.body
          ? { "Content-Type": "application/json; charset=utf-8" }
          : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      throw new EnterpriseApiError(
        "انتهت مهلة الاتصال بالخادم.",
        0,
        url,
      );
    }

    throw new EnterpriseApiError(
      error instanceof Error
        ? `تعذر الاتصال بخادم CreatorOS: ${error.message}`
        : "تعذر الاتصال بخادم CreatorOS.",
      0,
      url,
    );
  } finally {
    window.clearTimeout(timeoutId);
  }

  const rawBody = await response.text();

  let payload: unknown = null;

  if (rawBody.trim()) {
    try {
      payload = JSON.parse(rawBody) as unknown;
    } catch {
      throw new EnterpriseApiError(
        `الخادم أعاد محتوى غير صالح بدل JSON. الرابط: ${url}`,
        response.status,
        url,
        rawBody.slice(0, 500),
      );
    }
  }

  if (!response.ok) {
    throw new EnterpriseApiError(
      extractErrorMessage(
        payload,
        `فشل الطلب برمز HTTP ${response.status}.`,
      ),
      response.status,
      url,
      payload,
    );
  }

  if (payload === null) {
    throw new EnterpriseApiError(
      "أعاد الخادم استجابة فارغة.",
      response.status,
      url,
    );
  }

  return unwrapPayload<T>(payload);
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