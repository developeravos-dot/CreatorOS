import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { NoveltyGenerationV3Service } from '../v3/novelty-generation-v3.service';
import { GenerateNoveltyV31Dto } from './dto/generate-novelty-v3-1.dto';
import { CitationReadyPriorArtEngine } from './engines/citation-ready-prior-art.engine';
import { ClaimSupportMatrixEngine } from './engines/claim-support-matrix.engine';
import { EvidenceConfidenceEngine } from './engines/evidence-confidence.engine';
import { EvidenceNormalizerEngine } from './engines/evidence-normalizer.engine';
import { FalseConfidenceGuardEngine } from './engines/false-confidence-guard.engine';
import { PatentSearchPlanEngine } from './engines/patent-search-plan.engine';
import { PatentUncertaintyEngine } from './engines/patent-uncertainty.engine';
import { PriorArtCoverageEngine } from './engines/prior-art-coverage.engine';
import type {
  NoveltyV31Result,
  PatentEvidenceRecord,
} from './models/novelty-v3-1.models';

@Injectable()
export class NoveltyGenerationV31Service {
  constructor(
    private readonly v3Service:
      NoveltyGenerationV3Service,

    private readonly evidenceNormalizer:
      EvidenceNormalizerEngine,

    private readonly evidenceConfidenceEngine:
      EvidenceConfidenceEngine,

    private readonly claimSupportMatrixEngine:
      ClaimSupportMatrixEngine,

    private readonly priorArtCoverageEngine:
      PriorArtCoverageEngine,

    private readonly uncertaintyEngine:
      PatentUncertaintyEngine,

    private readonly falseConfidenceGuard:
      FalseConfidenceGuardEngine,

    private readonly patentSearchPlanEngine:
      PatentSearchPlanEngine,

    private readonly citationReadyEngine:
      CitationReadyPriorArtEngine,
  ) {}

  generate(
    dto: GenerateNoveltyV31Dto,
  ): NoveltyV31Result {
    this.validate(dto);

    const runId = randomUUID();

    const baseV3 =
      this.v3Service.generate(dto);

    const evidenceRecords =
      this.evidenceNormalizer.normalize(
        dto.evidenceRecords,
      );

    const evidenceConfidence =
      this.evidenceConfidenceEngine.evaluate(
        evidenceRecords,
      );

    const claimSupportMatrix =
      this.claimSupportMatrixEngine.build(
        baseV3,
        evidenceRecords,
      );

    const priorArtCoverage =
      this.priorArtCoverageEngine.evaluate(
        baseV3,
        evidenceRecords,
        claimSupportMatrix,
      );

    const hasPrototypeEvidence =
      evidenceRecords.some(
        (record) =>
          record.type === 'prototype' &&
          record.verificationStatus !==
            'rejected',
      );

    const hasExperimentEvidence =
      evidenceRecords.some(
        (record) =>
          record.type === 'experiment' &&
          record.verificationStatus !==
            'rejected',
      );

    const uncertainty =
      this.uncertaintyEngine.evaluate(
        evidenceConfidence,
        priorArtCoverage,
        claimSupportMatrix,
        hasPrototypeEvidence,
        hasExperimentEvidence,
      );

    const technicalValidation =
      this.technicalValidation(
        evidenceRecords,
      );

    const calibrated =
      this.falseConfidenceGuard.calibrate(
        baseV3.scores.protectability,
        evidenceConfidence,
        priorArtCoverage,
        claimSupportMatrix,
        uncertainty,
        technicalValidation,
      );

    const patentSearchPlan =
      this.patentSearchPlanEngine.build(
        baseV3,
        claimSupportMatrix,
        this.integer(
          dto.maximumSearchQueries ?? 20,
          1,
          50,
        ),
      );

    const citationReadyPriorArtReport =
      this.citationReadyEngine.build(
        baseV3.priorArtReasoning,
        evidenceRecords,
        claimSupportMatrix,
      );

    const minimumEvidenceConfidence =
      dto.minimumEvidenceConfidence ?? 65;

    const minimumPriorArtCoverage =
      dto.minimumPriorArtCoverage ?? 65;

    const minimumClaimSupportCoverage =
      dto.minimumClaimSupportCoverage ?? 70;

    const maximumAllowedUncertainty =
      dto.maximumAllowedUncertainty ?? 35;

    const evidenceSupported =
      evidenceConfidence.confidenceScore >=
        minimumEvidenceConfidence &&
      priorArtCoverage.coverageScore >=
        minimumPriorArtCoverage &&
      calibrated.scores
        .claimSupportCoverage >=
        minimumClaimSupportCoverage &&
      uncertainty.totalUncertainty <=
        maximumAllowedUncertainty &&
      calibrated.scores
        .finalCalibratedProtectability >=
        70;

    const provisionallySupported =
      calibrated.scores
        .finalCalibratedProtectability >=
        45 &&
      claimSupportMatrix.some(
        (row) =>
          row.status === 'supported' ||
          row.status ===
            'partially-supported',
      );

    const status:
      NoveltyV31Result['status'] =
        evidenceSupported
          ? 'evidence-supported'
          : provisionallySupported
            ? 'provisionally-supported'
            : 'evidence-insufficient';

    const proceedToFormalSearch =
      status !== 'evidence-supported';

    const proceedToPatentDrafting =
      status === 'evidence-supported' ||
      (status ===
        'provisionally-supported' &&
        calibrated.scores
          .claimSupportCoverage >= 60);

    const proceedToFiling =
      status === 'evidence-supported' &&
      priorArtCoverage
        .verifiedPatentReferences >= 3 &&
      uncertainty.totalUncertainty <= 25 &&
      calibrated.scores
        .finalCalibratedProtectability >=
        78;

    return {
      success: true,
      engine:
        'Protectable Idea Novelty Generation Engine',
      version: '3.1.0',
      runId,
      status,

      baseV3,

      evidenceRecords,
      evidenceConfidence,

      claimSupportMatrix,
      priorArtCoverage,
      uncertainty,

      falseConfidenceFindings:
        calibrated.findings,

      calibratedScores:
        calibrated.scores,

      patentSearchPlan,
      citationReadyPriorArtReport,

      decision: {
        proceedToFormalSearch,
        proceedToPatentDrafting,
        proceedToFiling,

        reason:
          this.decisionReason(
            status,
            evidenceConfidence
              .confidenceScore,
            priorArtCoverage.coverageScore,
            calibrated.scores
              .claimSupportCoverage,
            uncertainty.totalUncertainty,
            calibrated.scores
              .finalCalibratedProtectability,
          ),

        requiredNextEvidence:
          this.requiredNextEvidence(
            evidenceRecords,
            evidenceConfidence
              .confidenceScore,
            priorArtCoverage.coverageScore,
            calibrated.scores
              .claimSupportCoverage,
            uncertainty.totalUncertainty,
          ),
      },

      legalNotice:
        'هذا النظام يعاير الثقة ويمنع اعتبار التحليل الداخلي إثباتًا قانونيًا. النتيجة لا تمثل رأيًا قانونيًا، ولا تثبت الجدة أو الخطوة الابتكارية أو قابلية منح البراءة. البحث الرسمي والمراجعة المهنية يظلان مطلوبين.',
    };
  }

  getStatus() {
    return {
      success: true,
      engine:
        'Protectable Idea Novelty Generation Engine',
      version: '3.1.0',
      phase:
        'Evidence-Calibrated Patent Reasoning',
      status: 'operational',

      architecture: {
        v3InventiveReasoning: true,
        evidenceConfidenceEngine: true,
        priorArtEvidenceRecords: true,
        claimToSupportMatrix: true,
        noveltyUncertaintyScore: true,
        falseConfidenceGuard: true,
        patentSearchAdapterInterface: true,
        citationReadyPriorArtReport: true,
        calibratedProtectabilityScore: true,
        filingReadinessGate: true,
      },

      scoreSeparation: {
        heuristicProtectability: true,
        evidenceConfidence: true,
        verifiedPriorArtCoverage: true,
        claimSupportCoverage: true,
        uncertainty: true,
        finalCalibratedProtectability: true,
      },

      confidenceRules: {
        noExternalEvidenceMaximum:
          65,
        noVerifiedPatentMaximum:
          72,
        lowPriorArtCoverageMaximum:
          60,
        lowClaimSupportMaximum:
          58,
      },
    };
  }

  private technicalValidation(
    records: PatentEvidenceRecord[],
  ): number {
    const prototypes =
      records.filter(
        (record) =>
          record.type === 'prototype' &&
          record.verificationStatus !==
            'rejected',
      );

    const experiments =
      records.filter(
        (record) =>
          record.type === 'experiment' &&
          record.verificationStatus !==
            'rejected',
      );

    const prototypeScore =
      prototypes.length === 0
        ? 0
        : this.average(
            prototypes.map(
              (record) =>
                record.reliability * 0.5 +
                record.relevance * 0.5,
            ),
          );

    const experimentScore =
      experiments.length === 0
        ? 0
        : this.average(
            experiments.map(
              (record) =>
                record.reliability * 0.5 +
                record.relevance * 0.5,
            ),
          );

    if (
      prototypes.length > 0 &&
      experiments.length > 0
    ) {
      return this.clamp(
        prototypeScore * 0.45 +
          experimentScore * 0.55,
      );
    }

    if (prototypes.length > 0) {
      return this.clamp(
        prototypeScore * 0.65,
      );
    }

    if (experiments.length > 0) {
      return this.clamp(
        experimentScore * 0.7,
      );
    }

    return 10;
  }

  private decisionReason(
    status:
      NoveltyV31Result['status'],
    evidenceConfidence: number,
    priorArtCoverage: number,
    claimSupport: number,
    uncertainty: number,
    calibratedScore: number,
  ): string {
    if (
      status === 'evidence-supported'
    ) {
      return (
        `تم تجاوز بوابات الأدلة: ` +
        `ثقة الأدلة ${this.round(evidenceConfidence)}، ` +
        `تغطية الفن السابق ${this.round(priorArtCoverage)}، ` +
        `دعم المطالبات ${this.round(claimSupport)}، ` +
        `عدم اليقين ${this.round(uncertainty)}، ` +
        `والدرجة المعايرة ${this.round(calibratedScore)}.`
      );
    }

    if (
      status ===
      'provisionally-supported'
    ) {
      return (
        `الفكرة مدعومة داخليًا بصورة أولية، لكن الأدلة الخارجية أو تغطية الفن السابق غير كافية. ` +
        `الدرجة المعايرة الحالية ${this.round(calibratedScore)} مع عدم يقين ${this.round(uncertainty)}.`
      );
    }

    return (
      `الأدلة غير كافية لاتخاذ قرار حماية موثوق. ` +
      `ثقة الأدلة ${this.round(evidenceConfidence)}، ` +
      `وتغطية الفن السابق ${this.round(priorArtCoverage)}، ` +
      `ودعم المطالبات ${this.round(claimSupport)}.`
    );
  }

  private requiredNextEvidence(
    records: PatentEvidenceRecord[],
    evidenceConfidence: number,
    priorArtCoverage: number,
    claimSupport: number,
    uncertainty: number,
  ): string[] {
    const output: string[] = [];

    const patentCount =
      records.filter(
        (record) =>
          record.type ===
          'patent-document',
      ).length;

    const publicationCount =
      records.filter(
        (record) =>
          record.type ===
            'scientific-publication' ||
          record.type ===
            'prior-art-document',
      ).length;

    if (patentCount < 5) {
      output.push(
        'خمس وثائق براءات مرتبطة بالآليات الأساسية.',
      );
    }

    if (publicationCount < 3) {
      output.push(
        'ثلاثة مراجع تقنية أو علمية على الأقل.',
      );
    }

    if (
      !records.some(
        (record) =>
          record.type === 'prototype',
      )
    ) {
      output.push(
        'دليل نموذج أولي للآليات الجوهرية.',
      );
    }

    if (
      !records.some(
        (record) =>
          record.type === 'experiment',
      )
    ) {
      output.push(
        'نتائج اختبار أو محاكاة تثبت الأثر التقني.',
      );
    }

    if (evidenceConfidence < 65) {
      output.push(
        'رفع نسبة الأدلة المتحققة وتنويع المصادر.',
      );
    }

    if (priorArtCoverage < 65) {
      output.push(
        'بحث فن سابق يغطي كل آلية وكل مطالبة مستقلة.',
      );
    }

    if (claimSupport < 70) {
      output.push(
        'ربط عناصر المطالبات بأوصاف تقنية وأدلة مباشرة.',
      );
    }

    if (uncertainty > 35) {
      output.push(
        'تقليل عدم اليقين قبل اتخاذ قرار الإيداع.',
      );
    }

    return [
      ...new Set(output),
    ];
  }

  private validate(
    dto: GenerateNoveltyV31Dto,
  ): void {
    if (!dto || typeof dto !== 'object') {
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
      dto.description.trim().length < 20
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
