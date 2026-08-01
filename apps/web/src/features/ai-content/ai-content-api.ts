export type Platform = 'YouTube' | 'TikTok' | 'Both';

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

interface ApiErrorResponse {
  message?: string | string[];
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:3000';

export async function createProductionPackage(
  input: ProductionPackageRequest,
): Promise<ProductionPackageResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/enterprise/ai-content/production-package`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(input),
    },
  );

  const payload = (await response.json()) as
    | ProductionPackageResponse
    | ApiErrorResponse;

  if (!response.ok) {
    const errorPayload = payload as ApiErrorResponse;
    const message = Array.isArray(errorPayload.message)
      ? errorPayload.message.join('، ')
      : errorPayload.message;

    throw new Error(message || `فشل الطلب برمز ${response.status}`);
  }

  return payload as ProductionPackageResponse;
}