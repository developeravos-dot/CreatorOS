export type Platform = "YouTube" | "TikTok";
export type ContentPlatform = Platform | "Both";

export type Channel = {
  id: string;
  name: string;
  platform: Platform;
  category: string;
  status: "connected" | "setup";
  createdAt: string;
};

export type ContentItem = {
  id: string;
  title: string;
  platform: ContentPlatform;
  format: string;
  status:
    | "idea"
    | "research"
    | "script"
    | "voice"
    | "video"
    | "thumbnail"
    | "scheduled"
    | "published";
  progress: number;
  createdAt: string;
};

export type DashboardState = {
  channels: Channel[];
  content: ContentItem[];
  system: {
    api: "operational";
    scriptEngine: "ready";
    analysisEngine: "ready";
    productionEngine: "ready";
  };
};

const API_BASE =
  localStorage.getItem("creatoros-api-url") || "http://localhost:3000";

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const creatorApi = {
  getDashboard() {
    return request<DashboardState>("/creator/dashboard");
  },

  addChannel(input: {
    name: string;
    platform: Platform;
    category: string;
  }) {
    return request<Channel>("/creator/channels", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  removeChannel(id: string) {
    return request<{ success: true }>(`/creator/channels/${id}`, {
      method: "DELETE",
    });
  },

  addContent(input: {
    title: string;
    platform: ContentPlatform;
    format: string;
  }) {
    return request<ContentItem>("/creator/content", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  advanceContent(id: string) {
    return request<ContentItem>(`/creator/content/${id}/advance`, {
      method: "PATCH",
    });
  },

  removeContent(id: string) {
    return request<{ success: true }>(`/creator/content/${id}`, {
      method: "DELETE",
    });
  },
};