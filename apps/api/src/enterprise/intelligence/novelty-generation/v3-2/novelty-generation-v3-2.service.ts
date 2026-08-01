import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { PatentEvidenceRecordDto } from '../v3-1/dto/generate-novelty-v3-1.dto';
import { NoveltyGenerationV31Service } from '../v3-1/novelty-generation-v3-1.service';
import { GenerateNoveltyV32Dto } from './dto/generate-novelty-v3-2.dto';
import { AutomaticEvidenceIngestionEngine } from './engines/automatic-evidence-ingestion.engine';
import { ClaimLevelSimilarityEngine } from './engines/claim-level-similarity.engine';
import { PatentDocumentNormalizerEngine } from './engines/patent-document-normalizer.engine';
import { PatentSearchAdapterRegistry } from './engines/patent-search-adapter-registry.engine';
import { PatentSearchJobOrchestrator } from './engines/patent-search-job-orchestrator.engine';
import type {
  NoveltyV32Result,
  PatentSearchExecutionSummary,
  PatentSearchProviderId,
} from './models/novelty-v3-2.models';

@Injectable()
export class NoveltyGenerationV32Service {
  constructor(
    private readonly v31Service:
      NoveltyGenerationV31Service,

    private readonly registry:
      PatentSearchAdapterRegistry,

    private readonly orchestrator:
      PatentSearchJobOrchestrator,

    private readonly normalizer:
      PatentDocumentNormalizerEngine,

    private readonly similarityEngine:
      ClaimLevelSimilarityEngine,

    private readonly evidenceIngestion:
      AutomaticEvidenceIngestionEngine,
  ) {}

  async generate(
    dto: GenerateNoveltyV32Dto,
  ): Promise<NoveltyV32Result> {
    this.validate(dto);

    const runId = randomUUID();
    const startedAt = Date.now();

    const baselineCalibration =
      this.v31Service.generate(dto);

    const requestedProviders =
      this.providers(
        dto.searchProviders,
      );

    const providerRegistry =
      this.registry.getStatuses();

    const availableProviderIds =
      providerRegistry
        .filter(
          (provider) =>
            provider.enabled &&
            provider.available,
        )
        .map(
          (provider) => provider.id,
        );

    const executableProviders =
      requestedProviders.filter(
        (provider) =>
          availableProviderIds.includes(
            provider,
          ),
      );

    const plans =
      baselineCalibration
        .patentSearchPlan
        .slice(
          0,
          this.integer(
            dto.maximumQueriesToExecute ??
              12,
            1,
            50,
          ),
        );

    const contextPatterns = [
      ...(dto.priorArtPatterns ?? []),
      ...(dto.knownCompetitorPatterns ??
        []),
    ];

    const searchJobs =
      executableProviders.length === 0
        ? []
        : await this.orchestrator.execute(
            plans,
            {
              providers:
                executableProviders,

              maximumDocumentsPerQuery:
                this.integer(
                  dto.maximumDocumentsPerQuery ??
                    3,
                  1,
                  100,
                ),

              language:
                dto.searchLanguage ??
                'ar',

              jurisdiction:
                dto.jurisdiction,

              dateFrom:
                dto.searchDateFrom,

              dateTo:
                dto.searchDateTo,

              contextPatterns,
            },
          );

    const normalizedDocuments =
      this.normalizer.normalize(
        searchJobs,
      );

    const claimSimilarityAnalysis =
      this.similarityEngine.analyze(
        baselineCalibration.baseV3
          .draftPatentClaims,
        normalizedDocuments,
      );

    const autoEvidenceIngestion =
      this.evidenceIngestion.ingest(
        normalizedDocuments,
        claimSimilarityAnalysis,
      );

    const mergedEvidence =
      this.mergeEvidence(
        dto.evidenceRecords ?? [],
        autoEvidenceIngestion
          .evidenceRecords,
      );

    const recalibratedResult =
      this.v31Service.generate({
        ...dto,
        evidenceRecords:
          mergedEvidence,
      });

    const durationMs =
      Date.now() - startedAt;

    const executionSummary =
      this.summary(
        requestedProviders,
        availableProviderIds,
        searchJobs,
        normalizedDocuments,
        durationMs,
      );

    const externalProviderUsed =
      searchJobs.some(
        (job) =>
          job.status === 'completed' &&
          job.providerId !==
            'local-simulation',
      );

    const verifiedDocumentsFound =
      normalizedDocuments.some(
        (document) =>
          document.verificationStatus ===
            'verified' &&
          !document.synthetic,
      );

    const status =
      this.status(
        requestedProviders,
        executableProviders,
        searchJobs,
      );

    return {
      success: true,
      engine:
        'Protectable Idea Novelty Generation Engine',
      version: '3.2.0',
      runId,
      status,

      baselineCalibration,

      providerRegistry,
      searchPlan: plans,
      searchJobs,

      normalizedDocuments,
      claimSimilarityAnalysis,

      executionSummary,
      autoEvidenceIngestion,

      recalibratedResult,

      decision: {
        formalSearchExecuted:
          searchJobs.length > 0,

        externalProviderUsed,

        verifiedDocumentsFound,

        filingReady:
          recalibratedResult.decision
            .proceedToFiling,

        nextAction:
          this.nextAction(
            status,
            externalProviderUsed,
            verifiedDocumentsFound,
            recalibratedResult.decision
              .proceedToFiling,
          ),

        limitations:
          this.limitations(
            requestedProviders,
            executableProviders,
            normalizedDocuments,
          ),
      },
    };
  }

  getStatus() {
    return {
      success: true,
      engine:
        'Protectable Idea Novelty Generation Engine',
      version: '3.2.0',
      phase:
        'Patent Search Execution Layer',
      status: 'operational',

      architecture: {
        v31EvidenceCalibration: true,
        patentSearchAdapterRegistry: true,
        searchJobOrchestrator: true,
        providerAdapters: true,
        normalizedPatentDocuments: true,
        claimLevelSimilarityAnalysis: true,
        automaticEvidenceIngestion: true,
        automaticV31Recalibration: true,
      },

      providers:
        this.registry.getStatuses(),

      safetyRules: {
        syntheticDocumentsAreUnverified:
          true,
        localSimulationCannotEnableFiling:
          true,
        filingRequiresVerifiedExternalEvidence:
          true,
        providerAdaptersAreReplaceable:
          true,
      },
    };
  }

  private mergeEvidence(
    manual:
      PatentEvidenceRecordDto[],
    automatic:
      NoveltyV32Result['autoEvidenceIngestion']['evidenceRecords'],
  ): PatentEvidenceRecordDto[] {
    const convertedAutomatic:
      PatentEvidenceRecordDto[] =
      automatic.map((record) => ({
        title: record.title,
        type: record.type,
        source: record.source,
        reference: record.reference,
        publicationNumber:
          record.publicationNumber,
        publicationDate:
          record.publicationDate,
        supports: record.supports,
        contradicts:
          record.contradicts,
        relevance: record.relevance,
        reliability:
          record.reliability,
        verificationStatus:
          record.verificationStatus,
        notes: record.notes,
      }));

    const all = [
      ...manual,
      ...convertedAutomatic,
    ];

    const seen = new Set<string>();
    const output:
      PatentEvidenceRecordDto[] = [];

    for (const record of all) {
      const key = (
        record.publicationNumber ||
        record.reference ||
        `${record.type}:${record.title}`
      )
        .toLowerCase()
        .trim();

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      output.push(record);
    }

    return output;
  }

  private summary(
    requestedProviders:
      PatentSearchProviderId[],
    availableProviders:
      PatentSearchProviderId[],
    jobs:
      NoveltyV32Result['searchJobs'],
    documents:
      NoveltyV32Result['normalizedDocuments'],
    durationMs: number,
  ): PatentSearchExecutionSummary {
    return {
      requestedProviders,

      availableProviders:
        requestedProviders.filter(
          (provider) =>
            availableProviders.includes(
              provider,
            ),
        ),

      unavailableProviders:
        requestedProviders.filter(
          (provider) =>
            !availableProviders.includes(
              provider,
            ),
        ),

      jobsCreated: jobs.length,

      jobsCompleted:
        jobs.filter(
          (job) =>
            job.status === 'completed',
        ).length,

      jobsFailed:
        jobs.filter(
          (job) =>
            job.status === 'failed',
        ).length,

      totalDocuments:
        jobs.reduce(
          (sum, job) =>
            sum +
            job.documentsFound,
          0,
        ),

      uniqueDocuments:
        documents.length,

      verifiedDocuments:
        documents.filter(
          (document) =>
            document
              .verificationStatus ===
              'verified' &&
            !document.synthetic,
        ).length,

      syntheticDocuments:
        documents.filter(
          (document) =>
            document.synthetic,
        ).length,

      durationMs,
    };
  }

  private status(
    requested:
      PatentSearchProviderId[],
    executable:
      PatentSearchProviderId[],
    jobs:
      NoveltyV32Result['searchJobs'],
  ): NoveltyV32Result['status'] {
    if (executable.length === 0) {
      return 'provider-configuration-required';
    }

    if (
      jobs.length > 0 &&
      jobs.every(
        (job) =>
          job.status === 'failed',
      )
    ) {
      return 'search-failed';
    }

    if (
      requested.length !==
        executable.length ||
      jobs.some(
        (job) =>
          job.status !== 'completed',
      )
    ) {
      return 'search-partial';
    }

    return 'search-completed';
  }

  private nextAction(
    status:
      NoveltyV32Result['status'],
    externalProviderUsed: boolean,
    verifiedDocumentsFound: boolean,
    filingReady: boolean,
  ): string {
    if (filingReady) {
      return 'مراجعة النتائج مع مختص براءات قبل إعداد ملف الإيداع النهائي.';
    }

    if (!externalProviderUsed) {
      return 'تهيئة مزود بحث براءات خارجي ثم إعادة تشغيل V3.2.';
    }

    if (!verifiedDocumentsFound) {
      return 'التحقق من الوثائق المسترجعة وإضافة بيانات النشر والمصادر الموثوقة.';
    }

    if (
      status === 'search-partial'
    ) {
      return 'إكمال مهام البحث الفاشلة أو غير المتاحة ثم إعادة المعايرة.';
    }

    return 'مراجعة مصفوفة التشابه وتصميم مسارات التفاف للمطالبات عالية المخاطر.';
  }

  private limitations(
    requested:
      PatentSearchProviderId[],
    executable:
      PatentSearchProviderId[],
    documents:
      NoveltyV32Result['normalizedDocuments'],
  ): string[] {
    const output: string[] = [];

    if (
      executable.includes(
        'local-simulation',
      )
    ) {
      output.push(
        'نتائج local-simulation ليست وثائق براءات فعلية.',
      );
    }

    const unavailable =
      requested.filter(
        (provider) =>
          !executable.includes(
            provider,
          ),
      );

    if (unavailable.length > 0) {
      output.push(
        `مزودات غير مهيأة: ${unavailable.join(', ')}`,
      );
    }

    if (
      !documents.some(
        (document) =>
          document
            .verificationStatus ===
            'verified',
      )
    ) {
      output.push(
        'لا توجد وثائق متحققة في نتيجة البحث الحالية.',
      );
    }

    return output;
  }

  private providers(
    values?:
      PatentSearchProviderId[],
  ): PatentSearchProviderId[] {
    if (
      !Array.isArray(values) ||
      values.length === 0
    ) {
      return ['local-simulation'];
    }

    return [
      ...new Set(values),
    ];
  }

  private validate(
    dto: GenerateNoveltyV32Dto,
  ): void {
    if (
      !dto ||
      typeof dto !== 'object'
    ) {
      throw new BadRequestException(
        'Request body is required.',
      );
    }

    if (
      !dto.title ||
      dto.title.trim().length < 3
    ) {
      throw new BadRequestException(
        'title must contain at least 3 characters.',
      );
    }

    if (
      !dto.description ||
      dto.description.trim().length <
        20
    ) {
      throw new BadRequestException(
        'description must contain at least 20 characters.',
      );
    }
  }

  private integer(
    value: number,
    minimum: number,
    maximum: number,
  ): number {
    if (!Number.isFinite(value)) {
      return minimum;
    }

    return Math.max(
      minimum,
      Math.min(
        maximum,
        Math.floor(value),
      ),
    );
  }
}
