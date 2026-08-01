import { Injectable } from '@nestjs/common';

import type {
  ClaimCoverageAnalysis,
  ExtractedClaimElement,
  MechanismSimilarityResult,
} from '../models/novelty-v3-3.models';

@Injectable()
export class ClaimCoverageAnalyzerEngine {
  analyze(
    elements: ExtractedClaimElement[],
    similarities: MechanismSimilarityResult[],
  ): ClaimCoverageAnalysis[] {
    const claimNumbers = [
      ...new Set(
        elements.map(
          (element) =>
            element.claimNumber,
        ),
      ),
    ].sort(
      (left, right) =>
        left - right,
    );

    return claimNumbers.map(
      (claimNumber) => {
        const claimElements =
          elements.filter(
            (element) =>
              element.claimNumber ===
              claimNumber,
          );

        const supportedElements =
          claimElements.filter(
            (element) =>
              element
                .supportReferences
                .length > 0,
          );

        const highRiskElements =
          claimElements.filter(
            (element) =>
              similarities.some(
                (similarity) =>
                  similarity.verified &&
                  (
                    similarity.risk ===
                      'high' ||
                    similarity.risk ===
                      'critical'
                  ) &&
                  similarity.sharedElements
                    .some((shared) =>
                      this.overlaps(
                        shared,
                        element.text,
                      ),
                    ),
              ),
          );

        const externallyCovered =
          claimElements.filter(
            (element) =>
              similarities.some(
                (similarity) =>
                  similarity.verified &&
                  similarity.sharedElements
                    .some((shared) =>
                      this.overlaps(
                        shared,
                        element.text,
                      ),
                    ),
              ),
          );

        const distinguishing =
          claimElements.filter(
            (element) =>
              !externallyCovered.includes(
                element,
              ),
          );

        const unsupportedElements =
          claimElements
            .filter(
              (element) =>
                element
                  .supportReferences
                  .length === 0,
            )
            .map(
              (element) =>
                element.text,
            );

        const total =
          claimElements.length;

        const internalSupportCoverage =
          this.percentage(
            supportedElements.length,
            total,
          );

        const externalPriorArtCoverage =
          this.percentage(
            externallyCovered.length,
            total,
          );

        const distinguishingCoverage =
          this.percentage(
            distinguishing.length,
            total,
          );

        const finalCoverageScore =
          this.clamp(
            internalSupportCoverage *
              0.45 +
            distinguishingCoverage *
              0.35 +
            (
              100 -
              externalPriorArtCoverage
            ) *
              0.2,
          );

        return {
          claimNumber,
          totalElements: total,

          supportedElements:
            supportedElements.length,

          externallyCoveredElements:
            externallyCovered.length,

          distinguishingElements:
            distinguishing.length,

          unsupportedElements,

          highRiskElements:
            highRiskElements.map(
              (element) =>
                element.text,
            ),

          internalSupportCoverage:
            this.round(
              internalSupportCoverage,
            ),

          externalPriorArtCoverage:
            this.round(
              externalPriorArtCoverage,
            ),

          distinguishingCoverage:
            this.round(
              distinguishingCoverage,
            ),

          finalCoverageScore:
            this.round(
              finalCoverageScore,
            ),
        };
      },
    );
  }

  private percentage(
    value: number,
    total: number,
  ): number {
    if (total === 0) {
      return 0;
    }

    return (
      value /
      total
    ) * 100;
  }

  private overlaps(
    left: string,
    right: string,
  ): boolean {
    const leftTokens =
      this.tokens(left);

    const rightTokens =
      this.tokens(right);

    let matches = 0;

    for (const token of leftTokens) {
      if (rightTokens.has(token)) {
        matches += 1;
      }
    }

    return matches >= 2;
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
