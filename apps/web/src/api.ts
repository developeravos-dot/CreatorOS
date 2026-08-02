import { creatorClient } from "./api/core/client";

export type Platform =
  | "YouTube"
  | "TikTok";

export type ContentPlatform =
  | Platform
  | "Both";

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

/**
 * Compatibility facade.
 *
 * New code should import clients and services
 * from "./api".
 */
export const creatorApi = {
  getDashboard() {
    return creatorClient.get<DashboardState>(
      "/dashboard",
    );
  },

  addChannel(input: {
    name: string;
    platform: Platform;
    category: string;
  }) {
    return creatorClient.post<Channel>(
      "/channels",
      input,
    );
  },

  removeChannel(id: string) {
    return creatorClient.delete<{
      success: true;
    }>(
      `/channels/${encodeURIComponent(id)}`,
    );
  },

  addContent(input: {
    title: string;
    platform: ContentPlatform;
    format: string;
  }) {
    return creatorClient.post<ContentItem>(
      "/content",
      input,
    );
  },

  advanceContent(id: string) {
    return creatorClient.patch<ContentItem>(
      `/content/${encodeURIComponent(id)}/advance`,
    );
  },

  removeContent(id: string) {
    return creatorClient.delete<{
      success: true;
    }>(
      `/content/${encodeURIComponent(id)}`,
    );
  },
};
