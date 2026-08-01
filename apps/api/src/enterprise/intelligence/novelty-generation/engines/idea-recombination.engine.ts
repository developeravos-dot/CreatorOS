import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { IdeaCandidate } from '../models/novelty-generation.models';

@Injectable()
export class IdeaRecombinationEngine {
  recombine(
    candidates: IdeaCandidate[],
    generation: number,
    maximumResults = 6,
  ): IdeaCandidate[] {
    const results: IdeaCandidate[] = [];

    for (
      let leftIndex = 0;
      leftIndex < candidates.length &&
      results.length < maximumResults;
      leftIndex += 1
    ) {
      const rightIndex = leftIndex + 1;

      if (rightIndex >= candidates.length) {
        break;
      }

      const left = candidates[leftIndex]!;
      const right = candidates[rightIndex]!;

      results.push({
        id: randomUUID(),
        generation,
        parentIds: [left.id, right.id],
        title: `${this.cleanTitle(left.title)} × ${this.cleanTitle(right.title)}`,
        description:
          `${left.description} ويُدمج ذلك مع المبدأ التالي: ${right.description}`,
        targetUsers: this.unique([
          ...left.targetUsers,
          ...right.targetUsers,
        ]),
        problem:
          `${left.problem} بالإضافة إلى معالجة: ${right.problem}`,
        solution:
          `${left.solution} ويُعاد تركيبه مع: ${right.solution}`,
        businessModel:
          left.businessModel && right.businessModel
            ? `${left.businessModel} + ${right.businessModel}`
            : left.businessModel || right.businessModel,
        technology: this.unique([
          ...left.technology,
          ...right.technology,
        ]),
        differentiators: this.unique([
          ...left.differentiators,
          ...right.differentiators,
          'تركيب هجين بين آليتين مستقلتين',
        ]),
        sourceStrategy: 'Idea Recombination',
      });
    }

    return results;
  }

  private cleanTitle(value: string): string {
    return (value.split('—')[0] ?? value).trim();
  }

  private unique(values: string[]): string[] {
    return [...new Set(values.map((item) => item.trim()).filter(Boolean))];
  }
}

