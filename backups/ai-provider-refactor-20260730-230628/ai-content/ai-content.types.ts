export type AiContentPlatform = 'YouTube' | 'TikTok' | 'Both';

export type AiContentTone =
  | 'professional'
  | 'cinematic'
  | 'educational'
  | 'entertaining'
  | 'inspirational';

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