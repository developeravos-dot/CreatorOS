import { Injectable } from '@nestjs/common';
import type { PriorArtReasoningItem } from '../../v3/models/novelty-v3.models';
import type {
  CitationReadyPriorArtEntry,
  ClaimSupportMatrixRow,
  PatentEvidenceRecord,
} from '../models/novelty-v3-1.models';

@Injectable()
export class CitationReadyPriorArtEngine {
  build(
    priorArtReasoning:
      PriorArtReasoningItem[],
    evidence: PatentEvidenceRecord[],
    claimMatrix: ClaimSupportMatrixRow[],
  ): CitationReadyPriorArtEntry[] {
    const output:
      CitationReadyPriorArtEntry[] = [];

    for (const record of evidence) {
      if (
        ![
          'patent-document',
          'prior-art-document',
          'scientific-publication',
        ].includes(record.type)
      ) {
        continue;
      }

      const relevantClaims =
        claimMatrix
          .filter((row) =>
            [
              ...record.supports,
              ...record.contradicts,
            ].some(
              (value) =>
                this.overlaps(
                  value,
                  row.claimText,
                ),
            ),
          )
          .map(
            (row) =>
              row.claimNumber,
          );

      output.push({
        evidenceId: record.id,
        referenceLabel:
          record.publicationNumber ||
          record.reference ||
          record.title,

        title: record.title,
        publicationNumber:
          record.publicationNumber,
        publicationDate:
          record.publicationDate,
        source: record.source,

        relevantClaims,
        overlap: record.contradicts,
        differences: record.supports,

        risk: this.clamp(
          100 -
            (record.relevance * 0.55 +
              record.reliability *
                0.45),
        ),

        verified:
          record.verificationStatus ===
          'verified',

        citationStatus:
          this.citationStatus(record),
      });
    }

    for (
      const heuristic of
      priorArtReasoning
    ) {
      output.push({
        referenceLabel:
          `Heuristic: ${heuristic.pattern}`,
        title: heuristic.pattern,

        relevantClaims: [],
        overlap: heuristic.overlap,
        differences:
          heuristic.differences,
        risk: heuristic.residualRisk,

        verified: false,
        citationStatus: 'unverified',
      });
    }

    return output;
  }

  private citationStatus(
    record: PatentEvidenceRecord,
  ): CitationReadyPriorArtEntry['citationStatus'] {
    if (
      !record.source &&
      !record.reference &&
      !record.publicationNumber
    ) {
      return 'missing-source';
    }

    if (
      record.verificationStatus ===
        'verified' &&
      record.title &&
      (record.publicationNumber ||
        record.reference)
    ) {
      return 'ready';
    }

    if (
      record.verificationStatus ===
      'unverified'
    ) {
      return 'unverified';
    }

    return 'partial';
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

  private clamp(
    value: number,
  ): number {
    return Math.max(
      0,
      Math.min(100, value),
    );
  }
}
