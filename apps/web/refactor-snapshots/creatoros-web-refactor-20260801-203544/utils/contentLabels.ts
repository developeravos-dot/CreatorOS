import type {
  EnterprisePlatform,
  ProjectStatus,
  ScriptStatus,
} from "../enterprise-api";

export const statusLabels: Record<ProjectStatus, string> = {
  planning: "تخطيط",
  active: "نشط",
  paused: "متوقف مؤقتًا",
  completed: "مكتمل",
};

export const scriptStatusLabels: Record<ScriptStatus, string> = {
  draft: "مسودة",
  review: "مراجعة",
  approved: "معتمد",
  production: "إنتاج",
};

export const platformLabels: Record<EnterprisePlatform, string> = {
  YouTube: "YouTube",
  TikTok: "TikTok",
  Both: "YouTube + TikTok",
};
