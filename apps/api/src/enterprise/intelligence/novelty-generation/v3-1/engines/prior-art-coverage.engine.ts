import { Injectable } from '@nestjs/common';
import type { NoveltyV3Result } from '../../v3/models/novelty-v3.models';
import type {
  ClaimSupportMatrixRow,
  PatentEvidenceRecord,
  PriorArtCoverageReport,
} from '../models/novelty-v3-1.models';

@Injectable()
export class PriorArtCoverageEngine {
  evaluate(
    v3: NoveltyV3Result,
    evidence: PatentEvidenceRecord[],
    claimMatrix: ClaimSupportMatrixRow[],
  ): PriorArtCoverageReport {
    const priorArtEvidence =
      evidence.filter((record) =>
        [
          'patent-document',
          'prior-art-document',
          'scientific-publication',
        ].includes(record.type),
      );

    const verifiedPriorArtEvidence =
      priorArtEvidence.filter(
        (record) =>
          record.verificationStatus === 'verified',
      );

    const verifiedPatentReferences =
      verifiedPriorArtEvidence.filter(
        (record) =>
          record.type === 'patent-document',
      ).length;

    const verifiedPublicationReferences =
      verifiedPriorArtEvidence.filter(
        (record) =>
          record.type !== 'patent-document',
      ).length;

    const claimCoverage =
      this.verifiedClaimCoverage(
        claimMatrix,
        verifiedPriorArtEvidence,
      );

    const mechanismCoverage =
      this.verifiedMechanismCoverage(
        v3,
        verifiedPriorArtEvidence,
      );

    const sourceCount =
      new Set(
        verifiedPriorArtEvidence.map(
          (record) =>
            record.source ||
            record.reference ||
            record.title,
        ),
      ).size;

    const searchCoverage =
      verifiedPriorArtEvidence.length === 0
        ? 0
        : this.clamp(
            verifiedPriorArtEvidence.length * 8 +
              sourceCount * 6 +
              verifiedPatentReferences * 8 +
              verifiedPublicationReferences * 5,
          );

    const coverageScore =
      verifiedPriorArtEvidence.length === 0
        ? 0
        : this.clamp(
            claimCoverage * 0.4 +
              mechanismCoverage * 0.3 +
              searchCoverage * 0.3,
          );

    return {
      heuristicPatternsAnalyzed:
        v3.priorArtReasoning.length,

      evidenceBackedReferences:
        verifiedPriorArtEvidence.length,

      verifiedPatentReferences,
      verifiedPublicationReferences,

      claimCoverage:
        this.round(claimCoverage),

      mechanismCoverage:
        this.round(mechanismCoverage),

      searchCoverage:
        this.round(searchCoverage),

      coverageScore:
        this.round(coverageScore),

      coverageLevel:
        this.level(coverageScore),

      uncoveredAreas:
        this.uncoveredAreas(
          v3,
          verifiedPriorArtEvidence,
          claimMatrix,
        ),
    };
  }

  private verifiedClaimCoverage(
    claimMatrix: ClaimSupportMatrixRow[],
    verifiedEvidence: PatentEvidenceRecord[],
  ): number {
    if (
      claimMatrix.length === 0 ||
      verifiedEvidence.length === 0
    ) {
      return 0;
    }

    const coveredClaims =
      claimMatrix.filter((row) =>
        verifiedEvidence.some((record) =>
          [
            ...record.supports,
            ...record.contradicts,
          ].some((value) =>
            this.overlaps(
              value,
              row.claimText,
            ),
          ),
        ),
      ).length;

    return (
      coveredClaims /
      claimMatrix.length
    ) * 100;
  }

  private verifiedMechanismCoverage(
    v3: NoveltyV3Result,
    verifiedEvidence: PatentEvidenceRecord[],
  ): number {
    if (
      v3.inventiveMechanisms.length === 0 ||
      verifiedEvidence.length === 0
    ) {
      return 0;
    }

    const coveredMechanisms =
      v3.inventiveMechanisms.filter(
        (mechanism) =>
          verifiedEvidence.some(
            (record) =>
              [
                ...record.supports,
                ...record.contradicts,
              ].some(
                (value) =>
                  this.overlaps(
                    value,
                    mechanism.name,
                  ) ||
                  this.overlaps(
                    value,
                    mechanism.mechanism,
                  ),
              ),
          ),
      ).length;

    return (
      coveredMechanisms /
      v3.inventiveMechanisms.length
    ) * 100;
  }

  private uncoveredAreas(
    v3: NoveltyV3Result,
    evidence: PatentEvidenceRecord[],
    claimMatrix: ClaimSupportMatrixRow[],
  ): string[] {
    const output: string[] = [];

    if (
      !evidence.some(
        (record) =>
          record.type === 'patent-document',
      )
    ) {
      output.push(
        'لا توجد وثائق براءات فعلية متحققة.',
      );
    }

    if (
      !evidence.some(
        (record) =>
          record.type ===
          'scientific-publication',
      )
    ) {
      output.push(
        'لا توجد منشورات تقنية أو علمية متحققة.',
      );
    }

    for (
      const mechanism of
      v3.inventiveMechanisms
    ) {
      const covered =
        evidence.some((record) =>
          [
            ...record.supports,
            ...record.contradicts,
          ].some(
            (value) =>
              this.overlaps(
                value,
                mechanism.name,
              ) ||
              this.overlaps(
                value,
                mechanism.mechanism,
              ),
          ),
        );

      if (!covered) {
        output.push(
          `لم تتم تغطية الآلية بأدلة متحققة: ${mechanism.name}`,
        );
      }
    }

    for (const row of claimMatrix) {
      const covered =
        evidence.some((record) =>
          [
            ...record.supports,
            ...record.contradicts,
          ].some((value) =>
            this.overlaps(
              value,
              row.claimText,
            ),
          ),
        );

      if (!covered) {
        output.push(
          `المطالبة ${row.claimNumber} غير مغطاة بأدلة متحققة.`,
        );
      }
    }

    return [
      ...new Set(output),
    ];
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

  private level(
    score: number,
  ): PriorArtCoverageReport['coverageLevel'] {
    if (score >= 85) {
      return 'strong';
    }

    if (score >= 65) {
      return 'substantial';
    }

    if (score >= 40) {
      return 'partial';
    }

    if (score > 0) {
      return 'limited';
    }

    return 'none';
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
