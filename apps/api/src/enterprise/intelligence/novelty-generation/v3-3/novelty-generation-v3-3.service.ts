import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import { NoveltyGenerationV32Service } from '../v3-2/novelty-generation-v3-2.service';

import { GenerateNoveltyV33Dto } from './dto/generate-novelty-v3-3.dto';

import { ClaimCoverageAnalyzerEngine } from './engines/claim-coverage-analyzer.engine';
import { ClaimElementExtractorEngine } from './engines/claim-element-extractor.engine';
import { InventiveStepReasoningEngine } from './engines/inventive-step-reasoning.engine';
import { MechanismSignatureEngine } from './engines/mechanism-signature.engine';
import { MechanismSimilarityEngine } from './engines/mechanism-similarity.engine';
import { PatentabilityExplanationEngine } from './engines/patentability-explanation.engine';
import { PriorArtKnowledgeGraphEngine } from './engines/prior-art-knowledge-graph.engine';

import type {
  NoveltyV33Result,
  NoveltyV33Scores,
} from './models/novelty-v3-3.models';

@Injectable()
export class NoveltyGenerationV33Service {
  constructor(
    private readonly v32Service:
      NoveltyGenerationV32Service,

    private readonly claimExtractor:
      ClaimElementExtractorEngine,

    private readonly mechanismSignatureEngine:
      MechanismSignatureEngine,

    private readonly graphEngine:
      PriorArtKnowledgeGraphEngine,

    private readonly similarityEngine:
      MechanismSimilarityEngine,

    private readonly inventiveStepEngine:
      InventiveStepReasoningEngine,

    private readonly claimCoverageEngine:
      ClaimCoverageAnalyzerEngine,

    private readonly explanationEngine:
      PatentabilityExplanationEngine,
  ) {}

  async generate(
    dto: GenerateNoveltyV33Dto,
  ): Promise<NoveltyV33Result> {
    this.validate(dto);

    const runId = randomUUID();

    const executeSearch =
      dto.executeSearchBeforeReasoning ??
      true;

    const v32 = executeSearch
      ? await this.v32Service.generate(dto)
      : await this.v32Service.generate({
          ...dto,
          searchProviders: [
            'local-simulation',
          ],
          maximumQueriesToExecute: 1,
          maximumDocumentsPerQuery: 1,
        });

    const baseV3 =
      v32.baselineCalibration.baseV3;

    const claims =
      baseV3.draftPatentClaims;

    const mechanisms =
      baseV3.inventiveMechanisms;

    const includeSynthetic =
      dto.includeSyntheticDocumentsInGraph ??
      false;

    const documents =
      v32.normalizedDocuments
        .filter(
          (document) =>
            includeSynthetic ||
            !document.synthetic,
        )
        .slice(
          0,
          this.integer(
            dto.maximumGraphDocuments ??
              50,
            1,
            100,
          ),
        );

    const claimElements =
      this.claimExtractor.extract(
        claims,
      );

    const mechanismSignatures =
      this.mechanismSignatureEngine.create(
        mechanisms,
        this.clean(
          dto.additionalMechanisms,
        ),
        this.clean(
          dto.additionalTechnicalEffects,
        ),
      );

    const knowledgeGraph =
      this.graphEngine.build(
        dto.title,
        claimElements,
        mechanismSignatures,
        documents,
      );

    const mechanismSimilarity =
      this.similarityEngine.analyze(
        mechanismSignatures,
        documents,
        this.integer(
          dto.maximumSimilarityResults ??
            100,
          1,
          100,
        ),
      );

    const inventiveStepReasoning =
      this.inventiveStepEngine.analyze(
        mechanismSignatures,
        mechanismSimilarity,
      );

    const claimCoverage =
      this.claimCoverageEngine.analyze(
        claimElements,
        mechanismSimilarity,
      );

    const verifiedDocuments =
      documents.filter(
        (document) =>
          document.verificationStatus ===
            'verified' &&
          !document.synthetic,
      ).length;

    const syntheticDocuments =
      documents.filter(
        (document) =>
          document.synthetic,
      ).length;

    const explainableReport =
      this.explanationEngine.generate(
        claimCoverage,
        inventiveStepReasoning,
        mechanismSimilarity,
        verifiedDocuments,
      );

    const scores =
      this.calculateScores(
        claimElements.length,
        mechanismSignatures.length,
        knowledgeGraph.metrics.nodeCount,
        knowledgeGraph.metrics.edgeCount,
        mechanismSimilarity,
        inventiveStepReasoning.map(
          (item) =>
            item.inventiveStepScore,
        ),
        claimCoverage.map(
          (item) =>
            item.finalCoverageScore,
        ),
        verifiedDocuments,
        v32.recalibratedResult
          .uncertainty.totalUncertainty,
      );

    const highRiskDetected =
      mechanismSimilarity.some(
        (result) =>
          result.verified &&
          (
            result.risk === 'high' ||
            result.risk ===
              'critical'
          ),
      );

    const status:
      NoveltyV33Result['status'] =
        highRiskDetected
          ? 'high-risk-detected'
          : verifiedDocuments === 0
            ? 'external-evidence-required'
            : 'analysis-completed';

    return {
      success: true,
      engine:
        'Protectable Idea Novelty Generation Engine',
      version: '3.3.0',
      runId,
      status,

      claimElements,
      mechanismSignatures,
      knowledgeGraph,
      mechanismSimilarity,
      inventiveStepReasoning,
      claimCoverage,
      explainableReport,
      scores,

      sourceSummary: {
        claimsAnalyzed:
          claims.length,

        mechanismsAnalyzed:
          mechanismSignatures.length,

        documentsAnalyzed:
          documents.length,

        verifiedDocuments,
        syntheticDocuments,
      },
    };
  }

  getStatus() {
    return {
      success: true,
      engine:
        'Protectable Idea Novelty Generation Engine',
      version: '3.3.0',
      phase:
        'Patent Reasoning and Knowledge Graph',
      status: 'operational',

      architecture: {
        v32PatentSearchExecution: true,
        claimElementExtraction: true,
        mechanismSignatureExtraction: true,
        priorArtKnowledgeGraph: true,
        mechanismSimilarityEngine: true,
        inventiveStepReasoning: true,
        claimCoverageAnalyzer: true,
        patentabilityExplanationEngine: true,
        explainablePatentReport: true,
      },

      graphEntities: [
        'idea',
        'claims',
        'claim elements',
        'mechanisms',
        'technical effects',
        'patent documents',
        'classifications',
      ],

      safetyRules: {
        syntheticDocumentsExcludedByDefault:
          true,

        noVerifiedDocumentsMeansEvidenceRequired:
          true,

        verifiedHighSimilarityCreatesRisk:
          true,

        reportIsNotLegalAdvice:
          true,
      },
    };
  }

  private calculateScores(
    elementCount: number,
    mechanismCount: number,
    nodeCount: number,
    edgeCount: number,
    similarities: Array<{
      totalSimilarity: number;
      verified: boolean;
    }>,
    inventiveScores: number[],
    claimScores: number[],
    verifiedDocuments: number,
    uncertainty: number,
  ): NoveltyV33Scores {
    const graphCompleteness =
      this.clamp(
        nodeCount * 1.5 +
        edgeCount * 0.8,
      );

    const claimElementClarity =
      this.clamp(
        elementCount * 4,
      );

    const verifiedSimilarity =
      similarities.filter(
        (item) => item.verified,
      );

    const averageVerifiedSimilarity =
      this.average(
        verifiedSimilarity.map(
          (item) =>
            item.totalSimilarity,
        ),
      );

    const mechanismDistinctiveness =
      verifiedSimilarity.length === 0
        ? 35
        : this.clamp(
            100 -
            averageVerifiedSimilarity,
          );

    const inventiveStepReasoning =
      this.average(
        inventiveScores,
      );

    const claimCoverage =
      this.average(
        claimScores,
      );

    const explanationQuality =
      this.clamp(
        45 +
        mechanismCount * 7 +
        Math.min(
          claimScores.length * 3,
          20,
        ),
      );

    const evidenceConfidence =
      this.clamp(
        verifiedDocuments * 12,
      );

    const total =
      this.clamp(
        graphCompleteness * 0.12 +
        claimElementClarity * 0.13 +
        mechanismDistinctiveness * 0.17 +
        inventiveStepReasoning * 0.19 +
        claimCoverage * 0.16 +
        explanationQuality * 0.1 +
        evidenceConfidence * 0.08 +
        (100 - uncertainty) * 0.05,
      );

    return {
      graphCompleteness:
        this.round(
          graphCompleteness,
        ),

      claimElementClarity:
        this.round(
          claimElementClarity,
        ),

      mechanismDistinctiveness:
        this.round(
          mechanismDistinctiveness,
        ),

      inventiveStepReasoning:
        this.round(
          inventiveStepReasoning,
        ),

      claimCoverage:
        this.round(
          claimCoverage,
        ),

      explanationQuality:
        this.round(
          explanationQuality,
        ),

      evidenceConfidence:
        this.round(
          evidenceConfidence,
        ),

      uncertainty:
        this.round(
          uncertainty,
        ),

      total:
        this.round(total),
    };
  }

  private validate(
    dto: GenerateNoveltyV33Dto,
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

  private average(
    values: number[],
  ): number {
    if (values.length === 0) {
      return 0;
    }

    return (
      values.reduce(
        (sum, value) =>
          sum + value,
        0,
      ) /
      values.length
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
    return (
      Math.round(value * 100) /
      100
    );
  }
}
