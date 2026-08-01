import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PatentSearchAdapterRegistry } from './patent-search-adapter-registry.engine';
import type { PatentSearchQueryPlan } from '../../v3-1/models/novelty-v3-1.models';
import type {
  PatentSearchJob,
  PatentSearchProviderId,
  PatentSearchRequest,
} from '../models/novelty-v3-2.models';

export interface PatentSearchExecutionOptions {
  providers: PatentSearchProviderId[];
  maximumDocumentsPerQuery: number;
  language: string;
  jurisdiction?: string;
  dateFrom?: string;
  dateTo?: string;
  contextPatterns: string[];
}

@Injectable()
export class PatentSearchJobOrchestrator {
  constructor(
    private readonly registry:
      PatentSearchAdapterRegistry,
  ) {}

  async execute(
    plans: PatentSearchQueryPlan[],
    options: PatentSearchExecutionOptions,
  ): Promise<PatentSearchJob[]> {
    const jobs: PatentSearchJob[] = [];

    for (const plan of plans) {
      for (const providerId of options.providers) {
        const job =
          await this.executeSingle(
            plan,
            providerId,
            options,
          );

        jobs.push(job);
      }
    }

    return jobs;
  }

  private async executeSingle(
    plan: PatentSearchQueryPlan,
    providerId: PatentSearchProviderId,
    options: PatentSearchExecutionOptions,
  ): Promise<PatentSearchJob> {
    const jobId = randomUUID();
    const startedAt =
      new Date().toISOString();

    const adapter =
      this.registry.getAdapter(providerId);

    if (!adapter) {
      return {
        jobId,
        queryId: plan.queryId,
        providerId,
        status: 'provider-unavailable',
        startedAt,
        completedAt:
          new Date().toISOString(),
        documentsFound: 0,
        documents: [],
        errors: [
          `Provider adapter is not configured: ${providerId}`,
        ],
        warnings: [],
      };
    }

    const request:
      PatentSearchRequest = {
        jobId,
        queryPlan: plan,
        maximumDocuments:
          options.maximumDocumentsPerQuery,
        language: options.language,
        jurisdiction:
          options.jurisdiction,
        dateFrom: options.dateFrom,
        dateTo: options.dateTo,
        contextPatterns:
          options.contextPatterns,
      };

    try {
      const documents =
        await adapter.search(request);

      return {
        jobId,
        queryId: plan.queryId,
        providerId,
        status: 'completed',
        startedAt,
        completedAt:
          new Date().toISOString(),
        documentsFound:
          documents.length,
        documents,
        errors: [],
        warnings:
          providerId ===
          'local-simulation'
            ? [
                'النتائج محاكاة محلية وغير متحققة.',
              ]
            : [],
      };
    } catch (error) {
      return {
        jobId,
        queryId: plan.queryId,
        providerId,
        status: 'failed',
        startedAt,
        completedAt:
          new Date().toISOString(),
        documentsFound: 0,
        documents: [],
        errors: [
          error instanceof Error
            ? error.message
            : String(error),
        ],
        warnings: [],
      };
    }
  }
}

