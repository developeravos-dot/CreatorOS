import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DecisionRecord } from '../media-command-center.types';

@Injectable()
export class DecisionIntelligenceService {
  create(
    category: string,
    question: string,
    options: string[],
    recommendation: string,
    confidence: number,
    requiresHumanDecision = true,
  ): DecisionRecord {
    return {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      category,
      question,
      options,
      recommendation,
      confidence: Math.max(0, Math.min(1, confidence)),
      requiresHumanDecision,
    };
  }

  decide(
    record: DecisionRecord,
    decision: string,
    decidedBy: string,
  ) {
    if (!record.options.includes(decision)) {
      throw new Error('Decision must match one of the available options.');
    }

    record.decision = decision;
    record.decidedBy = decidedBy;
    record.decidedAt = new Date().toISOString();
    return record;
  }
}