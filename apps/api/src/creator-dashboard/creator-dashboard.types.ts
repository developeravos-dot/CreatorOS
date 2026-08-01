export type CreatorPlatform = "YouTube" | "TikTok";

export interface CreatorChannel {
  id: string;
  name: string;
  platform: CreatorPlatform;
  category: string;
  status: "connected" | "setup";
  createdAt: string;
}

export interface CreatorContent {
  id: string;
  title: string;
  platform: CreatorPlatform | "Both";
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
}

export interface CreatorDashboardState {
  channels: CreatorChannel[];
  content: CreatorContent[];
  system: {
    api: "operational";
    scriptEngine: "ready";
    analysisEngine: "ready";
    productionEngine: "ready";
  };
}