import { Injectable } from '@nestjs/common';
import type {
  EvaluatedIdeaDna,
  NoveltyV2Result,
} from '../models/novelty-v2.models';

@Injectable()
export class IdeaRebuilderEngine {
  rebuild(
    idea: EvaluatedIdeaDna,
  ): NoveltyV2Result['finalProtectableIdea'] {
    return {
      title: this.cleanTitle(idea.title),

      executiveSummary:
        `${idea.valueProposition.outcome} ` +
        `تعمل الفكرة عبر ${idea.mechanism.core} ` +
        `وتبني ميزة دفاعية من خلال ${this.joinOrFallback(
          idea.dataMoat.compoundingLoop,
          'تراكم المعرفة التشغيلية',
        )}.`,

      problem:
        `${idea.problem.statement} السبب الجذري: ${idea.problem.rootCause}`,

      solution:
        `${idea.mechanism.core} مستوى الأتمتة المستهدف: ${idea.mechanism.automationLevel}%.`,

      operatingMechanism: idea.mechanism.workflow,

      businessModel: [
        ...idea.businessModel.revenueStreams,
        ...idea.businessModel.pricingLogic,
        `وحدة القيمة: ${idea.businessModel.unitOfValue}`,
      ],

      proprietaryTechnology: [
        ...idea.technology.proprietaryComponents,
        ...idea.execution.autonomousRoles,
      ],

      protectableElements: [
        ...idea.intellectualProperty.protectableMechanisms,
        ...idea.intellectualProperty.protectableProcesses,
        ...idea.intellectualProperty.tradeSecrets,
      ],

      defensibility: [
        ...idea.intellectualProperty.defensibility,
        ...idea.network.networkEffects,
        ...idea.dataMoat.compoundingLoop,
      ],

      targetMarket: [
        ...idea.market.initialSegment,
        ...idea.market.adjacentSegments,
      ],
    };
  }

  private cleanTitle(value: string): string {
    return value.trim();
  }

  private joinOrFallback(
    values: string[],
    fallback: string,
  ): string {
    return values.length > 0
      ? values.join('، ')
      : fallback;
  }
}
