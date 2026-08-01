export type CreatorPlatform = "YouTube" | "TikTok";

export interface CreatorChannel {
  id: string;
  name: string;
  platform: CreatorPlatform;
  category: string;
  createdAt?: string;
}

export interface CreatorContent {
  id: string;
  title: string;
  platform: CreatorPlatform | "Both";
  format: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatorDashboard {
  channels: CreatorChannel[];
  content: CreatorContent[];
  system: {
    api: string;
    scriptEngine: string;
    analysisEngine?: string;
    productionEngine: string;
  };
}

const API_BASE = "/api/v1/creator";

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(
      `استجابة غير صالحة من الخادم: ${text.slice(0, 100)}`,
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ??
        `فشل الطلب برمز ${response.status}`,
    );
  }

  return data as T;
}

export const creatorApi = {
  health() {
    return request<{
      success: boolean;
      status: string;
    }>("/health");
  },

  dashboard() {
    return request<CreatorDashboard>("/dashboard");
  },

  addChannel(input: {
    name: string;
    platform: CreatorPlatform;
    category: string;
  }) {
    return request<CreatorChannel>("/channels", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  removeChannel(id: string) {
    return request<{ success: boolean }>(
      `/channels/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );
  },

  addContent(input: {
    title: string;
    platform: CreatorPlatform | "Both";
    format: string;
  }) {
    return request<CreatorContent>("/content", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  advanceContent(id: string) {
    return request<CreatorContent>(
      `/content/${encodeURIComponent(id)}/advance`,
      {
        method: "PATCH",
      },
    );
  },

  removeContent(id: string) {
    return request<{ success: boolean }>(
      `/content/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );
  },
};