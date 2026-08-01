import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { PatentEvidenceRecordDto } from '../dto/generate-novelty-v3-1.dto';
import type { PatentEvidenceRecord } from '../models/novelty-v3-1.models';

@Injectable()
export class EvidenceNormalizerEngine {
  normalize(
    records?: PatentEvidenceRecordDto[],
  ): PatentEvidenceRecord[] {
    if (!Array.isArray(records)) {
      return [];
    }

    return records.map((record) => ({
      id: randomUUID(),
      type: record.type,
      title: record.title.trim(),
      source: record.source?.trim(),
      reference: record.reference?.trim(),
      publicationNumber:
        record.publicationNumber?.trim(),
      publicationDate: record.publicationDate,

      supports: this.clean(record.supports),
      contradicts: this.clean(record.contradicts),

      relevance: this.clamp(
        record.relevance ?? 60,
      ),
      reliability: this.clamp(
        record.reliability ??
          this.defaultReliability(record.type),
      ),

      verificationStatus:
        record.verificationStatus ?? 'unverified',

      notes: this.clean(record.notes),
    }));
  }

  private defaultReliability(
    type: PatentEvidenceRecord['type'],
  ): number {
    switch (type) {
      case 'patent-document':
        return 85;

      case 'scientific-publication':
        return 80;

      case 'prior-art-document':
        return 75;

      case 'experiment':
        return 75;

      case 'prototype':
        return 70;

      case 'technical-definition':
        return 55;

      case 'market-evidence':
        return 50;

      case 'user-input':
        return 35;

      case 'internal-analysis':
        return 25;

      case 'unknown':
      default:
        return 20;
    }
  }

  private clean(
    values?: string[],
  ): string[] {
    if (!Array.isArray(values)) {
      return [];
    }

    return [
      ...new Set(
        values
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    ];
  }

  private clamp(value: number): number {
    return Math.max(
      0,
      Math.min(100, value),
    );
  }
}
