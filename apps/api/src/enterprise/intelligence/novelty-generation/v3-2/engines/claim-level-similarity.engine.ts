import { Injectable } from '@nestjs/common';
import type { DraftPatentClaim } from '../../v3/models/novelty-v3.models';
import type {
  ClaimSimilarityResult,
  NormalizedPatentDocument,
} from '../models/novelty-v3-2.models';

@Injectable()
export class ClaimLevelSimilarityEngine {
  analyze(
    claims: DraftPatentClaim[],
    documents: NormalizedPatentDocument[],
  ): ClaimSimilarityResult[] {
    const output:
      ClaimSimilarityResult[] = [];

    for (const claim of claims) {
      for (const document of documents) {
        output.push(
          this.compare(
            claim,
            document,
          ),
        );
      }
    }

    return output.sort(
      (left, right) =>
        right.claimSimilarity -
        left.claimSimilarity,
    );
  }

  private compare(
    claim: DraftPatentClaim,
    document: NormalizedPatentDocument,
  ): ClaimSimilarityResult {
    const claimElements =
      this.extractElements(
        claim.text,
        claim.supportElements,
      );

    const documentText = [
      document.title,
      document.abstract,
      ...document.claims,
    ].join(' ');

    const documentTokens =
      this.tokens(documentText);

    const overlappingElements =
      claimElements.filter((element) =>
        this.elementMatches(
          element,
          documentTokens,
        ),
      );

    const distinguishingElements =
      claimElements.filter(
        (element) =>
          !overlappingElements.includes(
            element,
          ),
      );

    const elementCoverage =
      claimElements.length === 0
        ? 0
        : (overlappingElements.length /
            claimElements.length) *
          100;

    const semanticOverlap =
      this.jaccard(
        this.tokens(claim.text),
        documentTokens,
      ) * 100;

    const claimSimilarity =
      this.clamp(
        elementCoverage * 0.65 +
          semanticOverlap * 0.35,
      );

    return {
      claimNumber:
        claim.claimNumber,

      documentId:
        document.documentId,

      publicationNumber:
        document.publicationNumber,

      documentTitle:
        document.title,

      claimSimilarity:
        this.round(
          claimSimilarity,
        ),

      elementCoverage:
        this.round(
          elementCoverage,
        ),

      semanticOverlap:
        this.round(
          semanticOverlap,
        ),

      overlappingElements,
      distinguishingElements,

      risk:
        this.risk(
          claimSimilarity,
        ),

      verified:
        document.verificationStatus ===
          'verified' &&
        !document.synthetic,
    };
  }

  private extractElements(
    text: string,
    supportElements: string[],
  ): string[] {
    const clauses = text
      .split(/[؛،.]/)
      .map((value) => value.trim())
      .filter(
        (value) => value.length >= 10,
      );

    return [
      ...new Set([
        ...supportElements,
        ...clauses,
      ]),
    ].slice(0, 25);
  }

  private elementMatches(
    element: string,
    documentTokens: Set<string>,
  ): boolean {
    const elementTokens =
      this.tokens(element);

    if (elementTokens.size === 0) {
      return false;
    }

    let matches = 0;

    for (const token of elementTokens) {
      if (documentTokens.has(token)) {
        matches += 1;
      }
    }

    return (
      matches >= 2 &&
      matches / elementTokens.size >=
        0.3
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

  private tokens(
    value: string,
  ): Set<string> {
    return new Set(
      value
        .toLowerCase()
        .replace(
          /[^\p{L}\p{N}\s]/gu,
          ' ',
        )
        .split(/\s+/)
        .map((item) => item.trim())
        .filter(
          (item) => item.length >= 3,
        ),
    );
  }

  private risk(
    similarity: number,
  ): ClaimSimilarityResult['risk'] {
    if (similarity >= 80) {
      return 'critical';
    }

    if (similarity >= 60) {
      return 'high';
    }

    if (similarity >= 35) {
      return 'moderate';
    }

    return 'low';
  }

  private clamp(
    value: number,
  ): number {
    return Math.max(
      0,
      Math.min(100, value),
    );
  }

  private round(
    value: number,
  ): number {
    return Math.round(value * 100) / 100;
  }
}
