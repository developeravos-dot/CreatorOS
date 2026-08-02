import { enterpriseClient } from "./api/core/client";
import {
  ApiError,
} from "./api/core/errors";
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
async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const method =
    options.method?.toUpperCase() ?? "GET";

  let body: unknown = undefined;

  if (
    typeof options.body === "string" &&
    options.body.trim()
  ) {
    try {
      body = JSON.parse(options.body);
    } catch {
      body = options.body;
    }
  } else {
    body = options.body;
  }

  try {
    return await enterpriseClient.request<T>(
      path,
      {
        ...options,
        method,
        body,
      },
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw new EnterpriseApiError(
        error.message,
        error.status,
        error.url,
        error.payload,
      );
    }

    throw error;
  }
}


export type AiContentPlatform = "YouTube" | "TikTok" | "Both";
export type AiContentTone =
  | "professional"
  | "cinematic"
  | "educational"
  | "entertaining"
  | "inspirational";

export interface AiContentIdea {
  id: string;
  title: string;
  hook: string;
  angle: string;
  targetAudience: string;
  platform: AiContentPlatform;
  score: number;
  createdAt: string;
}

export interface AiContentScript {
  title: string;
  hook: string;
  introduction: string;
  sections: Array<{
    heading: string;
    narration: string;
    visualDirection: string;
  }>;
  callToAction: string;
  estimatedDurationSeconds: number;
}

export interface AiContentOptimization {
  titles: string[];
  description: string;
  tags: string[];
  hashtags: string[];
  thumbnailIdeas: string[];
}

export interface AiContentReview {
  overallScore: number;
  clarityScore: number;
  retentionScore: number;
  originalityScore: number;
  platformFitScore: number;
  strengths: string[];
  risks: string[];
  recommendations: string[];
}

export interface AiContentProductionPackage {
  success: boolean;
  idea: AiContentIdea;
  script: AiContentScript;
  optimization: AiContentOptimization;
  review: AiContentReview;
  productionPlan: {
    visualStyle: string;
    voiceStyle: string;
    musicDirection: string;
    editingStyle: string;
    publishingRecommendation: string;
  };
}
export const enterpriseApi = {
  health() {
    return request<{
      success: boolean;
      status: string;
    }>("/health");
  },

  dashboard() {
    return enterpriseClient.get<EnterpriseDashboard>("/dashboard");
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

export const aiContentApi = {
  status() {
    return request<{
      success: boolean;
      module: string;
      status: string;
      capabilities: string[];
      version: string;
    }>("/ai-content/status");
  },

  generateIdeas(input: {
    topic: string;
    audience: string;
    platform: AiContentPlatform;
    count?: number;
    tone?: AiContentTone;
  }) {
    return request<{
      success: boolean;
      ideas: AiContentIdea[];
    }>("/ai-content/ideas", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  generateScript(input: {
    topic: string;
    audience: string;
    platform: AiContentPlatform;
    tone?: AiContentTone;
    durationSeconds?: number;
  }) {
    return request<{
      success: boolean;
      script: AiContentScript;
    }>("/ai-content/scripts", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  optimize(input: {
    title: string;
    content: string;
    platform: AiContentPlatform;
  }) {
    return request<{
      success: boolean;
      optimization: AiContentOptimization;
    }>("/ai-content/optimize", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  review(input: {
    title: string;
    content: string;
    platform: AiContentPlatform;
  }) {
    return request<{
      success: boolean;
      review: AiContentReview;
    }>("/ai-content/review", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  createProductionPackage(input: {
    topic: string;
    audience: string;
    platform: AiContentPlatform;
    tone?: AiContentTone;
    durationSeconds?: number;
  }) {
    return request<AiContentProductionPackage>(
      "/ai-content/production-package",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );
  },
};
