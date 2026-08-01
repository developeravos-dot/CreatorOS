import { Injectable } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import type { PatentSearchAdapter } from './patent-search-adapter';
import type {
  NormalizedPatentDocument,
  PatentSearchProviderStatus,
  PatentSearchRequest,
} from '../models/novelty-v3-2.models';

@Injectable()
export class LocalSimulationPatentAdapter
  implements PatentSearchAdapter
{
  getStatus(): PatentSearchProviderStatus {
    return {
      id: 'local-simulation',
      name: 'CreatorOS Local Prior-Art Simulation',
      enabled: true,
      available: true,
      mode: 'local-simulation',
      requiresCredentials: false,
      capabilities: [
        'deterministic local search simulation',
        'normalized document generation',
        'pipeline verification',
        'unverified evidence generation',
      ],
      limitation:
        'لا يتصل بقاعدة براءات فعلية ولا ينتج أدلة متحققة.',
    };
  }

  async search(
    request: PatentSearchRequest,
  ): Promise<NormalizedPatentDocument[]> {
    const patterns =
      request.contextPatterns.length > 0
        ? request.contextPatterns
        : [request.queryPlan.query];

    return patterns
      .slice(0, request.maximumDocuments)
      .map((pattern, index) =>
        this.createDocument(
          request,
          pattern,
          index,
        ),
      );
  }

  private createDocument(
    request: PatentSearchRequest,
    pattern: string,
    index: number,
  ): NormalizedPatentDocument {
    const normalizedPattern =
      pattern.trim() ||
      request.queryPlan.query;

    const hash = createHash('sha256')
      .update(
        `${request.queryPlan.query}:${normalizedPattern}:${index}`,
      )
      .digest('hex')
      .slice(0, 12)
      .toUpperCase();

    return {
      documentId: randomUUID(),
      providerId: 'local-simulation',

      title:
        `محاكاة فن سابق — ${normalizedPattern.slice(0, 100)}`,

      abstract:
        `سجل محاكاة محلي يمثل نمطًا محتملاً من الفن السابق مرتبطًا بالاستعلام: ${request.queryPlan.query}.`,

      claims: [
        normalizedPattern,
        request.queryPlan.query,
      ],

      publicationNumber:
        `SIM-${hash}`,

      applicants: [],
      inventors: [],
      classifications: [],

      sourceReference:
        `local-simulation://${hash}`,

      queryId:
        request.queryPlan.queryId,

      retrievedAt:
        new Date().toISOString(),

      verificationStatus: 'unverified',
      synthetic: true,
      rawScore:
        Math.max(20, 70 - index * 5),
    };
  }
}
