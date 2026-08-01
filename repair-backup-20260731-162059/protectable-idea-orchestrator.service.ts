import { Injectable } from '@nestjs/common';

import { AiSemanticOriginalityCriticService } from '../../../enterprise/ai-foundation/ai-semantic-originality-critic.service';

@Injectable()
export class ProtectableIdeaOrchestratorService {
  constructor(
    private readonly originalityCritic: AiSemanticOriginalityCriticService,
  ) {}

  async analyze(input: {
    request: string;
    content: string;
  }) {
    return await this.originalityCritic.review({
      request: input.request,
      content: input.content,
      originalityEvaluation: {
        overallScore: 0,
        noveltyScore: 0,
        similarityScore: 0,
        protectabilityScore: 0,
        reasoning: [],
      },
    });
  }
}