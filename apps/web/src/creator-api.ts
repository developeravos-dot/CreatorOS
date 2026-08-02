import { creatorClient } from "./api/core/client";

export type CreatorPlatform =
  | "YouTube"
  | "TikTok";

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

/**
 * Backward-compatible creator API.
 * All requests now pass through api/core/http.ts.
 */
export const creatorApi = {
  health() {
    return creatorClient.get<{
      success: boolean;
      status: string;
    }>("/health");
  },

  dashboard() {
    return creatorClient.get<CreatorDashboard>(
      "/dashboard",
    );
  },

  addChannel(input: {
    name: string;
    platform: CreatorPlatform;
    category: string;
  }) {
    return creatorClient.post<CreatorChannel>(
      "/channels",
      input,
    );
  },

  removeChannel(id: string) {
    return creatorClient.delete<{
      success: boolean;
    }>(
      `/channels/${encodeURIComponent(id)}`,
    );
  },

  addContent(input: {
    title: string;
    platform: CreatorPlatform | "Both";
    format: string;
  }) {
    return creatorClient.post<CreatorContent>(
      "/content",
      input,
    );
  },

  advanceContent(id: string) {
    return creatorClient.patch<CreatorContent>(
      `/content/${encodeURIComponent(id)}/advance`,
    );
  },

  removeContent(id: string) {
    return creatorClient.delete<{
      success: boolean;
    }>(
      `/content/${encodeURIComponent(id)}`,
    );
  },
};
