import { Injectable } from '@nestjs/common';

import type { InventiveMechanism } from '../../v3/models/novelty-v3.models';
import type { MechanismSignature } from '../models/novelty-v3-3.models';

@Injectable()
export class MechanismSignatureEngine {
  create(
    mechanisms: InventiveMechanism[],
    additionalMechanisms: string[],
    additionalTechnicalEffects: string[],
  ): MechanismSignature[] {
    const output = mechanisms.map(
      (mechanism): MechanismSignature => ({
        mechanismId: mechanism.name,
        name: mechanism.name,
        problem: mechanism.technicalProblem,
        inputs: this.unique(mechanism.inputs),
        operations: this.unique(
          mechanism.processingSteps,
        ),
        outputs: this.unique(mechanism.outputs),
        technicalEffects: this.unique([
          mechanism.technicalEffect,
          ...additionalTechnicalEffects,
        ]),
        constraints: this.extractConstraints(
          mechanism,
        ),
        signatureTokens: this.signature([
          mechanism.name,
          mechanism.technicalProblem,
          mechanism.mechanism,
          ...mechanism.inputs,
          ...mechanism.processingSteps,
          ...mechanism.outputs,
          mechanism.technicalEffect,
        ]),
      }),
    );

    for (
      let index = 0;
      index < additionalMechanisms.length;
      index += 1
    ) {
      const value =
        additionalMechanisms[index]?.trim();

      if (!value) {
        continue;
      }

      output.push({
        mechanismId: `additional-${index + 1}`,
        name: value,
        problem: '',
        inputs: [],
        operations: [value],
        outputs: [],
        technicalEffects:
          this.unique(additionalTechnicalEffects),
        constraints: [],
        signatureTokens:
          this.signature([
            value,
            ...additionalTechnicalEffects,
          ]),
      });
    }

    return output;
  }

  private extractConstraints(
    mechanism: InventiveMechanism,
  ): string[] {
    return [
      ...mechanism.inputs,
      ...mechanism.processingSteps,
    ].filter((value) => {
      const text = value.toLowerCase();

      return (
        text.includes('حد') ||
        text.includes('شرط') ||
        text.includes('قيد') ||
        text.includes('احتمال') ||
        text.includes('وقت') ||
        text.includes('كمية')
      );
    });
  }

  private signature(
    values: string[],
  ): string[] {
    return [
      ...new Set(
        values
          .join(' ')
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\s]/gu, ' ')
          .split(/\s+/)
          .map((token) => token.trim())
          .filter((token) => token.length >= 3),
      ),
    ].sort();
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
}
