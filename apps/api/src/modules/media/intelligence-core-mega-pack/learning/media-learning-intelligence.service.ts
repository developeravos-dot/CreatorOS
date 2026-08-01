import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { LearningRecord } from '../intelligence-core.types';

@Injectable()
export class MediaLearningIntelligenceService {
  create(
    source: string,
    observation: string,
    confidence: number,
  ): LearningRecord {
    const normalizedConfidence = Math.max(0, Math.min(1, confidence));

    return {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      source,
      observation,
      interpretation: this.interpret(observation),
      confidence: normalizedConfidence,
      reusableRule: this.ruleFrom(observation),
      validationStatus:
        normalizedConfidence >= 0.8
          ? 'candidate-for-human-validation'
          : 'requires-more-evidence',
    };
  }

  private interpret(observation: string) {
    return `The observed signal suggests a repeatable relationship: ${observation}`;
  }

  private ruleFrom(observation: string) {
    return `When comparable conditions appear, test the following pattern before applying it: ${observation}`;
  }
}