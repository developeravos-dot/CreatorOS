import {
  enterpriseClient,
} from "../../api/core/client";

export type Platform =
  | "YouTube"
  | "TikTok"
  | "Both";

export interface ProductionPackageRequest {
  topic: string;
  audience: string;
  platform: Platform;
  tone?: string;
  durationSeconds?: number;
}

export interface ContentSection {
  heading: string;
  narration: string;
  visualDirection: string;
  onScreenText: string;
  durationSeconds: number;
}

export interface ScenePlanItem {
  sceneNumber: number;
  heading: string;
  voiceOver: string;
  visualPrompt: string;
  onScreenText: string;
  music: string;
  soundEffects: string;
  editingDirection: string;
  durationSeconds: number;
}

export interface ProductionPackageResponse {
  success: boolean;
  provider: string;
  model: string;
  title: string;
  targetAudience: string[];
  platform: Platform;
  contentType: string;
  duration: number;
  hook: string;
  idea: {
    title: string;
    hook: string;
    angle: string;
    targetAudience: string;
  };
  script: {
    title: string;
    hook: string;
    introduction: string;
    sections: ContentSection[];
    callToAction: string;
    estimatedDurationSeconds: number;
  };
  sections: ContentSection[];
  scenePlan: ScenePlanItem[];
  productionPlan: {
    visualStyle: string;
    voiceStyle: string;
    musicStyle: string;
    editingStyle: string;
    thumbnailPrompt: string;
    requiredAssets: string[];
  };
  optimization: {
    title: string;
    description: string;
    tags: string[];
    hashtags: string[];
    keywords: string[];
  };
  qualityChecklist: string[];
}

export function createProductionPackage(
  input: ProductionPackageRequest,
): Promise<ProductionPackageResponse> {
  return enterpriseClient.post<ProductionPackageResponse>(
    "/ai-content/production-package",
    input,
  );
}
