import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type {
  PatentEvidenceRecord,
} from '../../v3-1/models/novelty-v3-1.models';
import type {
  AutoEvidenceIngestionResult,
  ClaimSimilarityResult,
  NormalizedPatentDocument,
} from '../models/novelty-v3-2.models';

@Injectable()
export class AutomaticEvidenceIngestionEngine {
  ingest(
    documents: NormalizedPatentDocument[],
    similarities: ClaimSimilarityResult[],
  ): AutoEvidenceIngestionResult {
    const evidenceRecords:
      PatentEvidenceRecord[] =
      documents.map((document) => {
        const related =
          similarities.filter(
            (similarity) =>
              similarity.documentId ===
              document.documentId,
          );

        const supports =
          related
            .flatMap(
              (similarity) =>
                similarity
                  .distinguishingElements,
            )
            .slice(0, 20);

        const contradicts =
          related
            .filter(
              (similarity) =>
                similarity.risk ===
                  'high' ||
                similarity.risk ===
                  'critical',
            )
            .flatMap(
              (similarity) =>
                similarity
                  .overlappingElements,
            )
            .slice(0, 20);

        const highestSimilarity =
          related.reduce(
            (highest, item) =>
              Math.max(
                highest,
                item.claimSimilarity,
              ),
            0,
          );

        const verified =
          document.verificationStatus ===
            'verified' &&
          !document.synthetic;

        return {
          id: randomUUID(),

          type:
            document.synthetic
              ? 'prior-art-document'
              : 'patent-document',

          title: document.title,

          source:
            document.providerId,

          reference:
            document.sourceReference,

          publicationNumber:
            document.publicationNumber,

          publicationDate:
            document.publicationDate,

          supports:
            this.unique(supports),

          contradicts:
            this.unique(contradicts),

          relevance:
            this.clamp(
              highestSimilarity,
            ),

          reliability:
            verified
              ? 90
              : document.synthetic
                ? 20
                : 55,

          verificationStatus:
            verified
              ? 'verified'
              : 'unverified',

          notes: [
            `Auto-ingested from provider: ${document.providerId}`,
            document.synthetic
              ? 'Synthetic local result; not legal evidence.'
              : 'External search result.',
          ],
        } satisfies PatentEvidenceRecord;
      });

    const patentEvidenceCreated =
      evidenceRecords.filter(
        (record) =>
          record.type ===
          'patent-document',
      ).length;

    const priorArtEvidenceCreated =
      evidenceRecords.filter(
        (record) =>
          record.type ===
          'prior-art-document',
      ).length;

    const verifiedEvidenceCreated =
      evidenceRecords.filter(
        (record) =>
          record.verificationStatus ===
          'verified',
      ).length;

    return {
      evidenceRecordsCreated:
        evidenceRecords.length,

      patentEvidenceCreated,
      priorArtEvidenceCreated,

      verifiedEvidenceCreated,

      unverifiedEvidenceCreated:
        evidenceRecords.length -
        verifiedEvidenceCreated,

      evidenceRecords,
    };
  }

  private unique(
    values: string[],
  ): string[] {
    return [
      ...new Set(
        values
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    ];
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
