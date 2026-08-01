import { Injectable } from '@nestjs/common';

import type {
  CanonicalIdentityFingerprint,
  VisualConsistencyValidation,
  VisualGenerationSnapshot,
} from '../models/visual-consistency.models';

@Injectable()
export class ConsistencyPromptRepairEngine {
  repair(
    fingerprint:
      CanonicalIdentityFingerprint,

    snapshot:
      VisualGenerationSnapshot,

    validation:
      VisualConsistencyValidation,
  ): {
    repairedPrompt: string;
    repairedNegativePrompt: string;
  } {
    const expected =
      fingerprint.canonicalValues;

    const repairInstructions =
      validation.deviations.map(
        (deviation) =>
          deviation.recommendedRepair,
      );

    const repairedPrompt = [
      snapshot.prompt,

      'CANONICAL IDENTITY LOCK:',

      expected.identityDescription,

      `LOCKED COLORS: ${expected.primaryColors.join(', ')}`,

      `LOCKED PROPORTIONS: ${expected.proportions.join(', ')}`,

      `REQUIRED SIGNATURE ELEMENTS: ${expected.signatureElements.join(', ')}`,

      expected.identityLockPrompt,

      ...repairInstructions,

      'The same canonical identity must be preserved exactly across all shots, scenes, episodes, languages, and providers.',
    ].join('. ');

    const repairedNegativePrompt = [
      snapshot.negativePrompt,
      expected.negativePrompt,

      'identity drift',
      'different face',
      'different age',
      'different body proportions',
      'different wardrobe',
      'missing signature elements',
      'wrong colors',
      'style drift',
      'character redesign',
      'environment redesign',
      'prop redesign',
    ].join(', ');

    return {
      repairedPrompt,
      repairedNegativePrompt,
    };
  }
}
