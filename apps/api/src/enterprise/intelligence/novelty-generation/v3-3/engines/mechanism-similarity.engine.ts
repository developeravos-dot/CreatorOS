import { Injectable } from '@nestjs/common';

import type {
  NormalizedPatentDocument,
} from '../../v3-2/models/novelty-v3-2.models';

import type {
  MechanismSignature,
  MechanismSimilarityResult,
} from '../models/novelty-v3-3.models';

@Injectable()
export class MechanismSimilarityEngine {
  analyze(
    mechanisms: MechanismSignature[],
    documents: NormalizedPatentDocument[],
    maximumResults: number,
  ): MechanismSimilarityResult[] {
    const output:
      MechanismSimilarityResult[] = [];

    for (const mechanism of mechanisms) {
      for (const document of documents) {
        output.push(
          this.compare(
            mechanism,
            document,
          ),
        );
      }
    }

    return output
      .sort(
        (left, right) =>
          right.totalSimilarity -
          left.totalSimilarity,
      )
      .slice(
        0,
        Math.max(
          1,
          maximumResults,
        ),
      );
  }

  private compare(
    mechanism: MechanismSignature,
    document: NormalizedPatentDocument,
  ): MechanismSimilarityResult {
    const documentText = [
      document.title,
      document.abstract,
      ...document.claims,
    ].join(' ');

    const documentTokens =
      this.tokens(documentText);

    const inputSimilarity =
      this.collectionSimilarity(
        mechanism.inputs,
        documentTokens,
      );

    const operationSimilarity =
      this.collectionSimilarity(
        mechanism.operations,
        documentTokens,
      );

    const outputSimilarity =
      this.collectionSimilarity(
        mechanism.outputs,
        documentTokens,
      );

    const technicalEffectSimilarity =
      this.collectionSimilarity(
        mechanism.technicalEffects,
        documentTokens,
      );

    const structuralSimilarity =
      this.jaccard(
        new Set(
          mechanism.signatureTokens,
        ),
        documentTokens,
      ) * 100;

    const totalSimilarity =
      this.clamp(
        inputSimilarity * 0.15 +
        operationSimilarity * 0.35 +
        outputSimilarity * 0.15 +
        technicalEffectSimilarity * 0.2 +
        structuralSimilarity * 0.15,
      );

    const allElements = [
      ...mechanism.inputs,
      ...mechanism.operations,
      ...mechanism.outputs,
      ...mechanism.technicalEffects,
      ...mechanism.constraints,
    ];

    const sharedElements =
      allElements.filter((element) =>
        this.elementMatches(
          element,
          documentTokens,
        ),
      );

    const distinguishingElements =
      allElements.filter(
        (element) =>
          !sharedElements.includes(element),
      );

    return {
      sourceMechanismId:
        mechanism.mechanismId,
      sourceMechanismName:
        mechanism.name,

      targetDocumentId:
        document.documentId,
      targetDocumentTitle:
        document.title,
      publicationNumber:
        document.publicationNumber,

      inputSimilarity:
        this.round(inputSimilarity),
      operationSimilarity:
        this.round(operationSimilarity),
      outputSimilarity:
        this.round(outputSimilarity),
      technicalEffectSimilarity:
        this.round(
          technicalEffectSimilarity,
        ),
      structuralSimilarity:
        this.round(
          structuralSimilarity,
        ),
      totalSimilarity:
        this.round(totalSimilarity),

      sharedElements,
      distinguishingElements,

      risk:
        this.risk(totalSimilarity),

      verified:
        document.verificationStatus ===
          'verified' &&
        !document.synthetic,
    };
  }

  private collectionSimilarity(
    values: string[],
    documentTokens: Set<string>,
  ): number {
    if (values.length === 0) {
      return 0;
    }

    const scores = values.map((value) => {
      const tokens = this.tokens(value);

      if (tokens.size === 0) {
        return 0;
      }

      let matches = 0;

      for (const token of tokens) {
        if (documentTokens.has(token)) {
          matches += 1;
        }
      }

      return (
        matches /
        tokens.size
      ) * 100;
    });

    return (
      scores.reduce(
        (sum, value) => sum + value,
        0,
      ) / scores.length
    );
  }

  private elementMatches(
    element: string,
    documentTokens: Set<string>,
  ): boolean {
    const tokens = this.tokens(element);

    if (tokens.size === 0) {
      return false;
    }

    let matches = 0;

    for (const token of tokens) {
      if (documentTokens.has(token)) {
        matches += 1;
      }
    }

    return (
      matches >= 2 &&
      matches / tokens.size >= 0.3
    );
  }

  private jaccard(
    left: Set<string>,
    right: Set<string>,
  ): number {
    const union = new Set([
      ...left,
      ...right,
    ]);

    if (union.size === 0) {
      return 0;
    }

    let intersection = 0;

    for (const token of left) {
      if (right.has(token)) {
        intersection += 1;
      }
    }

    return intersection / union.size;
  }

  private tokens(value: string): Set<string> {
    return new Set(
      value
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .split(/\s+/)
        .map((token) => token.trim())
        .filter((token) => token.length >= 3),
    );
  }

  private risk(
    value: number,
  ): MechanismSimilarityResult['risk'] {
    if (value >= 75) {
      return 'critical';
    }

    if (value >= 55) {
      return 'high';
    }

    if (value >= 30) {
      return 'moderate';
    }

    return 'low';
  }

  private clamp(value: number): number {
    return Math.max(
      0,
      Math.min(100, value),
    );
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
