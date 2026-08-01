export type EnterprisePlatform = "YouTube" | "TikTok" | "Both";

export type ProjectStatus =
  | "planning"
  | "active"
  | "paused"
  | "completed";

export type ScriptStatus =
  | "draft"
  | "review"
  | "approved"
  | "production";

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

export interface EnterpriseDatabase {
  projects: EnterpriseProject[];
  scripts: EnterpriseScript[];
  calendar: EnterpriseCalendarItem[];
  prompts: EnterprisePrompt[];
}