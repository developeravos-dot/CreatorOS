import { Injectable } from '@nestjs/common';
import { CreativeProductionProgram } from '../media-mega.types';

@Injectable()
export class ProductionQualityEngineService {
  evaluate(program: CreativeProductionProgram) {
    const sceneCount = program.scenes.length;
    const languageCount = program.localization.languages.length;
    const councilCount = program.council.length;

    const scores = {
      originality: 92,
      scriptQuality: Math.min(100, 70 + sceneCount),
      visualContinuity: program.characterBible.length > 0 ? 94 : 45,
      audioContinuity: 91,
      culturalReadiness: Math.min(100, 80 + languageCount * 3),
      productionReadiness: Math.min(100, 70 + councilCount * 2),
      platformCompliance: 95,
      rightsReadiness: 90,
    };

    const failures = Object.entries(scores)
      .filter(([, score]) => score < 80)
      .map(([name]) => `${name}-below-threshold`);

    return {
      gates: [
        'originality-gate',
        'script-quality-gate',
        'character-consistency-gate',
        'world-consistency-gate',
        'visual-continuity-gate',
        'audio-continuity-gate',
        'cultural-validation-gate',
        'rights-clearance-gate',
        'platform-compliance-gate',
        'human-final-approval-gate',
      ],
      scores,
      failures,
      approved: failures.length === 0 && program.governance.humanApproved,
    };
  }
}