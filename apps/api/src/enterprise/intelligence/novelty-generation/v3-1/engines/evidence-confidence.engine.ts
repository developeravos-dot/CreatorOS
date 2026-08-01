import { Injectable } from '@nestjs/common';
import type {
  EvidenceConfidenceReport,
  PatentEvidenceRecord,
} from '../models/novelty-v3-1.models';

@Injectable()
export class EvidenceConfidenceEngine {
  evaluate(
    records: PatentEvidenceRecord[],
  ): EvidenceConfidenceReport {
    const validRecords = records.filter(
      (record) =>
        record.verificationStatus !== 'rejected',
    );

    const verifiedEvidenceCount =
      validRecords.filter(
        (record) =>
          record.verificationStatus === 'verified',
      ).length;

    const externalEvidence = validRecords.filter(
      (record) =>
        ![
          'user-input',
          'internal-analysis',
          'technical-definition',
          'unknown',
        ].includes(record.type),
    );

    const patentDocumentCount =
      validRecords.filter(
        (record) =>
          record.type === 'patent-document',
      ).length;

    const publicationCount =
      validRecords.filter(
        (record) =>
          record.type ===
            'scientific-publication' ||
          record.type === 'prior-art-document',
      ).length;

    const averageReliability =
      this.average(
        validRecords.map(
          (record) => record.reliability,
        ),
      );

    const averageRelevance =
      this.average(
        validRecords.map(
          (record) => record.relevance,
        ),
      );

    const sourceDiversity =
      new Set(
        validRecords.map(
          (record) =>
            record.source ||
            record.type,
        ),
      ).size;

    const verificationCoverage =
      validRecords.length === 0
        ? 0
        : (verifiedEvidenceCount /
            validRecords.length) *
          100;

    const externalCoverage =
      validRecords.length === 0
        ? 0
        : (externalEvidence.length /
            validRecords.length) *
          100;

    const confidenceScore = this.clamp(
      averageReliability * 0.25 +
        averageRelevance * 0.15 +
        verificationCoverage * 0.25 +
        externalCoverage * 0.15 +
        Math.min(sourceDiversity * 8, 20),
    );

    return {
      evidenceRecordCount: validRecords.length,
      verifiedEvidenceCount,
      externalEvidenceCount:
        externalEvidence.length,
      patentDocumentCount,
      publicationCount,

      sourceDiversity,
      averageReliability:
        this.round(averageReliability),
      averageRelevance:
        this.round(averageRelevance),
      verificationCoverage:
        this.round(verificationCoverage),

      confidenceScore:
        this.round(confidenceScore),
      confidenceLevel:
        this.level(confidenceScore),

      limitations:
        this.limitations(
          validRecords.length,
          verifiedEvidenceCount,
          externalEvidence.length,
          patentDocumentCount,
          sourceDiversity,
        ),
    };
  }

  private limitations(
    recordCount: number,
    verifiedCount: number,
    externalCount: number,
    patentCount: number,
    diversity: number,
  ): string[] {
    const output: string[] = [];

    if (recordCount === 0) {
      output.push(
        'لا توجد سجلات أدلة خارجية.',
      );
    }

    if (verifiedCount === 0) {
      output.push(
        'لا توجد أدلة مصنفة كأدلة متحققة.',
      );
    }

    if (externalCount === 0) {
      output.push(
        'جميع النتائج مبنية على التحليل الداخلي أو إدخال المستخدم.',
      );
    }

    if (patentCount === 0) {
      output.push(
        'لم تتم إضافة وثائق براءات فعلية.',
      );
    }

    if (diversity < 3) {
      output.push(
        'تنوع مصادر الأدلة محدود.',
      );
    }

    return output;
  }

  private level(
    score: number,
  ): EvidenceConfidenceReport['confidenceLevel'] {
    if (score >= 85) {
      return 'very-high';
    }

    if (score >= 70) {
      return 'high';
    }

    if (score >= 50) {
      return 'moderate';
    }

    if (score >= 25) {
      return 'low';
    }

    return 'very-low';
  }

  private average(
    values: number[],
  ): number {
    if (values.length === 0) {
      return 0;
    }

    return (
      values.reduce(
        (sum, value) => sum + value,
        0,
      ) / values.length
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

  private round(
    value: number,
  ): number {
    return Math.round(value * 100) / 100;
  }
}
