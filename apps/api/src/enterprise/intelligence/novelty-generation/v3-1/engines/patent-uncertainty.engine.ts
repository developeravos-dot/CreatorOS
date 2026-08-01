import { Injectable } from '@nestjs/common';
import type {
  ClaimSupportMatrixRow,
  EvidenceConfidenceReport,
  PriorArtCoverageReport,
  UncertaintyReport,
} from '../models/novelty-v3-1.models';

@Injectable()
export class PatentUncertaintyEngine {
  evaluate(
    evidence: EvidenceConfidenceReport,
    priorArt: PriorArtCoverageReport,
    claimMatrix: ClaimSupportMatrixRow[],
    hasPrototypeEvidence: boolean,
    hasExperimentEvidence: boolean,
  ): UncertaintyReport {
    const averageClaimSupport =
      this.average(
        claimMatrix.map(
          (row) => row.supportCoverage,
        ),
      );

    const averageEvidenceCoverage =
      this.average(
        claimMatrix.map(
          (row) => row.evidenceCoverage,
        ),
      );

    const evidenceUncertainty =
      100 - evidence.confidenceScore;

    const priorArtUncertainty =
      100 - priorArt.coverageScore;

    const claimSupportUncertainty =
      100 -
      (averageClaimSupport * 0.55 +
        averageEvidenceCoverage * 0.45);

    const technicalValidation =
      hasPrototypeEvidence &&
      hasExperimentEvidence
        ? 80
        : hasPrototypeEvidence ||
            hasExperimentEvidence
          ? 45
          : 10;

    const technicalValidationUncertainty =
      100 - technicalValidation;

    const legalUncertainty =
      priorArt.verifiedPatentReferences > 0 &&
      evidence.verificationCoverage >= 60
        ? 35
        : 80;

    const totalUncertainty =
      this.clamp(
        evidenceUncertainty * 0.25 +
          priorArtUncertainty * 0.3 +
          claimSupportUncertainty * 0.2 +
          technicalValidationUncertainty *
            0.15 +
          legalUncertainty * 0.1,
      );

    return {
      evidenceUncertainty:
        this.round(evidenceUncertainty),
      priorArtUncertainty:
        this.round(priorArtUncertainty),
      claimSupportUncertainty:
        this.round(claimSupportUncertainty),
      technicalValidationUncertainty:
        this.round(
          technicalValidationUncertainty,
        ),
      legalUncertainty:
        this.round(legalUncertainty),

      totalUncertainty:
        this.round(totalUncertainty),

      majorUnknowns:
        this.majorUnknowns(
          evidence,
          priorArt,
          averageEvidenceCoverage,
          hasPrototypeEvidence,
          hasExperimentEvidence,
        ),

      reductionActions:
        this.reductionActions(
          evidence,
          priorArt,
          averageEvidenceCoverage,
          hasPrototypeEvidence,
          hasExperimentEvidence,
        ),
    };
  }

  private majorUnknowns(
    evidence: EvidenceConfidenceReport,
    priorArt: PriorArtCoverageReport,
    claimEvidenceCoverage: number,
    hasPrototype: boolean,
    hasExperiment: boolean,
  ): string[] {
    const output: string[] = [];

    if (
      evidence.patentDocumentCount === 0
    ) {
      output.push(
        'لا يُعرف مدى التشابه مع البراءات الفعلية.',
      );
    }

    if (
      priorArt.coverageScore < 60
    ) {
      output.push(
        'تغطية البحث في الفن السابق غير كافية.',
      );
    }

    if (
      claimEvidenceCoverage < 50
    ) {
      output.push(
        'عدد كبير من عناصر المطالبات غير مدعوم بأدلة خارجية.',
      );
    }

    if (!hasPrototype) {
      output.push(
        'لا يوجد نموذج أولي يثبت قابلية التنفيذ.',
      );
    }

    if (!hasExperiment) {
      output.push(
        'لا توجد نتائج اختبار تثبت الأثر التقني.',
      );
    }

    return output;
  }

  private reductionActions(
    evidence: EvidenceConfidenceReport,
    priorArt: PriorArtCoverageReport,
    claimEvidenceCoverage: number,
    hasPrototype: boolean,
    hasExperiment: boolean,
  ): string[] {
    const output: string[] = [];

    if (
      evidence.patentDocumentCount < 5
    ) {
      output.push(
        'إضافة خمس وثائق براءات ذات صلة على الأقل.',
      );
    }

    if (
      priorArt.verifiedPublicationReferences <
      3
    ) {
      output.push(
        'إضافة ثلاث منشورات تقنية أو علمية متحققة على الأقل.',
      );
    }

    if (
      claimEvidenceCoverage < 70
    ) {
      output.push(
        'ربط كل عنصر جوهري في المطالبات بمرجع أو دليل.',
      );
    }

    if (!hasPrototype) {
      output.push(
        'إنشاء نموذج أولي للآليات الجوهرية.',
      );
    }

    if (!hasExperiment) {
      output.push(
        'تنفيذ اختبار يقيس زمن التكوين ونسبة فشل المجموعات.',
      );
    }

    return output;
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
