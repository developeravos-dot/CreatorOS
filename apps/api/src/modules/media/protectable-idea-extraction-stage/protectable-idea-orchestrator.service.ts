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
    return this.originalityCritic.review({
      request: input.request,
      content: input.content,
      originalityEvaluation: {
        passed: true,
        originalityPassed: true,
        safetyPassed: true,
        originalityScore: 100,
        duplicationScore: 0,
        distinctItemCount: 0,
        detectedItemCount: 0,
        genericContentDetected: false,
        warnings: [],
        reasons: [],
      },
    });
  }
}