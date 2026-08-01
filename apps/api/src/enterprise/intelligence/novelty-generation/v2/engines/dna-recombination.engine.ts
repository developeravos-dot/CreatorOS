import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type {
  DnaMutationRecord,
  IdeaDna,
} from '../models/novelty-v2.models';

@Injectable()
export class DnaRecombinationEngine {
  recombine(
    candidates: IdeaDna[],
    generation: number,
    maximumResults: number,
  ): IdeaDna[] {
    const output: IdeaDna[] = [];
    const limit = Math.max(1, maximumResults);

    for (
      let index = 0;
      index + 1 < candidates.length &&
      output.length < limit;
      index += 2
    ) {
      const left = candidates[index];
      const right = candidates[index + 1];

      if (!left || !right) {
        continue;
      }

      const child = this.clone(left);

      child.id = randomUUID();
      child.generation = generation;
      child.parentIds = [left.id, right.id];
      child.title = `${this.baseTitle(left.title)} — Hybrid DNA`;

      child.valueProposition.unfairAdvantage = this.unique([
        ...left.valueProposition.unfairAdvantage,
        ...right.valueProposition.unfairAdvantage,
      ]);

      child.mechanism.workflow = this.unique([
        ...left.mechanism.workflow,
        ...right.mechanism.workflow,
      ]);

      child.businessModel.revenueStreams = this.unique([
        ...left.businessModel.revenueStreams,
        ...right.businessModel.revenueStreams,
      ]);

      child.businessModel.pricingLogic = this.unique([
        ...left.businessModel.pricingLogic,
        ...right.businessModel.pricingLogic,
      ]);

      child.technology.proprietaryComponents = this.unique([
        ...left.technology.proprietaryComponents,
        ...right.technology.proprietaryComponents,
      ]);

      child.network.networkEffects = this.unique([
        ...left.network.networkEffects,
        ...right.network.networkEffects,
      ]);

      child.dataMoat.capturedData = this.unique([
        ...left.dataMoat.capturedData,
        ...right.dataMoat.capturedData,
      ]);

      child.dataMoat.derivedKnowledge = this.unique([
        ...left.dataMoat.derivedKnowledge,
        ...right.dataMoat.derivedKnowledge,
      ]);

      child.dataMoat.compoundingLoop = this.unique([
        ...left.dataMoat.compoundingLoop,
        ...right.dataMoat.compoundingLoop,
      ]);

      child.intellectualProperty.protectableMechanisms = this.unique([
        ...left.intellectualProperty.protectableMechanisms,
        ...right.intellectualProperty.protectableMechanisms,
      ]);

      child.intellectualProperty.protectableProcesses = this.unique([
        ...left.intellectualProperty.protectableProcesses,
        ...right.intellectualProperty.protectableProcesses,
      ]);

      child.intellectualProperty.tradeSecrets = this.unique([
        ...left.intellectualProperty.tradeSecrets,
        ...right.intellectualProperty.tradeSecrets,
      ]);

      child.execution.autonomousRoles = this.unique([
        ...left.execution.autonomousRoles,
        ...right.execution.autonomousRoles,
      ]);

      child.distribution.embeddedDistribution = this.unique([
        ...left.distribution.embeddedDistribution,
        ...right.distribution.embeddedDistribution,
      ]);

      child.riskModel.controls = this.unique([
        ...left.riskModel.controls,
        ...right.riskModel.controls,
      ]);

      const record: DnaMutationRecord = {
        mutationId: randomUUID(),
        generation,
        dimension: 'mechanism',
        strategy: 'DNA Recombination',
        before: [left.id, right.id],
        after: [child.id],
        rationale:
          'دمج مكونات مفهومية متكاملة من مرشحين مختلفين دون دمج النصوص الطويلة.',
      };

      child.mutationHistory = [
        ...left.mutationHistory,
        ...right.mutationHistory,
        record,
      ];

      output.push(child);
    }

    return output;
  }

  private unique(values: string[]): string[] {
    return [
      ...new Set(
        values
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    ];
  }

  private baseTitle(value: string): string {
    return value.split('—')[0]?.trim() || value.trim();
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }
}
