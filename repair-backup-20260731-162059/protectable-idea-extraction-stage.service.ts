import { Injectable } from '@nestjs/common';

import { MediaIpEmpireEngineBase } from '../media-ip-empire-core/media-ip-empire-engine.base';

import { ProtectableIdeaOrchestratorService } from './protectable-idea-orchestrator.service';

@Injectable()
export class ProtectableIdeaExtractionStageService extends MediaIpEmpireEngineBase {
  constructor(
    private readonly orchestrator: ProtectableIdeaOrchestratorService,
  ) {
    super(
      'AVOS Media Protectable Idea Extraction',
      'protectable-idea-extraction',
    );
  }

  async analyzeIdea(input: {
    request: string;
    content: string;
  }) {
    const result = await this.orchestrator.analyze(input);

    return {
      success: true,
      stage: 'protectable-idea-extraction',
      timestamp: new Date().toISOString(),
      result,
    };
  }
}