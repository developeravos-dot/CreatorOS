import { enterpriseClient } from "../core/client";
import type {
  AiContentIdea,
  AiContentOptimization,
  AiContentPlatform,
  AiContentProductionPackage,
  AiContentReview,
  AiContentScript,
  AiContentTone,
  EnterprisePrompt,
} from "../../enterprise-api";

export const promptsApi = {
  create(input: {
    name: string;
    purpose: string;
    prompt: string;
  }) {
    return enterpriseClient.post<EnterprisePrompt>(
      "/prompts",
      input,
    );
  },
};

export const aiContentApi = {
  status() {
    return enterpriseClient.get<{
      success: boolean;
      module: string;
      status: string;
      capabilities: string[];
      version: string;
    }>("/ai-content/status");
  },

  generateIdeas(input: {
    topic: string;
    audience: string;
    platform: AiContentPlatform;
    count?: number;
    tone?: AiContentTone;
  }) {
    return enterpriseClient.post<{
      success: boolean;
      ideas: AiContentIdea[];
    }>("/ai-content/ideas", input);
  },

  generateScript(input: {
    topic: string;
    audience: string;
    platform: AiContentPlatform;
    tone?: AiContentTone;
    durationSeconds?: number;
  }) {
    return enterpriseClient.post<{
      success: boolean;
      script: AiContentScript;
    }>("/ai-content/scripts", input);
  },

  optimize(input: {
    title: string;
    content: string;
    platform: AiContentPlatform;
  }) {
    return enterpriseClient.post<{
      success: boolean;
      optimization: AiContentOptimization;
    }>("/ai-content/optimize", input);
  },

  review(input: {
    title: string;
    content: string;
    platform: AiContentPlatform;
  }) {
    return enterpriseClient.post<{
      success: boolean;
      review: AiContentReview;
    }>("/ai-content/review", input);
  },

  createProductionPackage(input: {
    topic: string;
    audience: string;
    platform: AiContentPlatform;
    tone?: AiContentTone;
    durationSeconds?: number;
  }) {
    return enterpriseClient.post<AiContentProductionPackage>(
      "/ai-content/production-package",
      input,
    );
  },
};
