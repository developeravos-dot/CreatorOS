import { Injectable } from '@nestjs/common';
import type {
  CalibratedPatentScores,
  ClaimSupportMatrixRow,
  EvidenceConfidenceReport,
  FalseConfidenceFinding,
  PriorArtCoverageReport,
  UncertaintyReport,
} from '../models/novelty-v3-1.models';

@Injectable()
export class FalseConfidenceGuardEngine {
  calibrate(
    heuristicProtectability: number,
    evidence: EvidenceConfidenceReport,
    priorArt: PriorArtCoverageReport,
    claimMatrix: ClaimSupportMatrixRow[],
    uncertainty: UncertaintyReport,
    technicalValidation: number,
  ): {
    scores: CalibratedPatentScores;
    findings: FalseConfidenceFinding[];
  } {
    const findings: FalseConfidenceFinding[] =
      [];

    const claimSupportCoverage =
      this.average(
        claimMatrix.map(
          (row) =>
            row.supportCoverage * 0.6 +
            row.evidenceCoverage * 0.4,
        ),
      );

    let cappedHeuristic =
      heuristicProtectability;

    if (
      evidence.externalEvidenceCount === 0 &&
      cappedHeuristic > 65
    ) {
      findings.push({
        code: 'NO_EXTERNAL_EVIDENCE',
        severity: 'critical',
        message:
          'تم تخفيض درجة قابلية الحماية لعدم وجود أدلة خارجية.',
        affectedMetric:
          'heuristicProtectability',
        originalValue:
          cappedHeuristic,
        cappedValue: 65,
        reason:
          'التحليل الداخلي وحده لا يثبت الجدة أو الخطوة الابتكارية.',
      });

      cappedHeuristic = 65;
    }

    if (
      priorArt.verifiedPatentReferences ===
        0 &&
      cappedHeuristic > 72
    ) {
      findings.push({
        code: 'NO_VERIFIED_PATENTS',
        severity: 'critical',
        message:
          'لا يمكن الاحتفاظ بدرجة مرتفعة دون وثائق براءات متحققة.',
        affectedMetric:
          'heuristicProtectability',
        originalValue:
          cappedHeuristic,
        cappedValue: 72,
        reason:
          'لم يتم إجراء تحقق فعلي ضد براءات منشورة.',
      });

      cappedHeuristic = 72;
    }

    if (
      priorArt.coverageScore < 40 &&
      cappedHeuristic > 60
    ) {
      findings.push({
        code:
          'LOW_PRIOR_ART_COVERAGE',
        severity: 'warning',
        message:
          'تغطية الفن السابق منخفضة.',
        affectedMetric:
          'heuristicProtectability',
        originalValue:
          cappedHeuristic,
        cappedValue: 60,
        reason:
          'البحث غير كافٍ لتقدير المسافة عن الفن السابق.',
      });

      cappedHeuristic = 60;
    }

    if (
      claimSupportCoverage < 50 &&
      cappedHeuristic > 58
    ) {
      findings.push({
        code:
          'LOW_CLAIM_SUPPORT',
        severity: 'warning',
        message:
          'المطالبات لا تمتلك دعمًا كافيًا.',
        affectedMetric:
          'heuristicProtectability',
        originalValue:
          cappedHeuristic,
        cappedValue: 58,
        reason:
          'عناصر جوهرية في المطالبات غير مدعومة.',
      });

      cappedHeuristic = 58;
    }

    const rawCalibrated =
      cappedHeuristic * 0.28 +
      evidence.confidenceScore * 0.18 +
      priorArt.coverageScore * 0.22 +
      claimSupportCoverage * 0.17 +
      technicalValidation * 0.15;

    const uncertaintyPenalty =
      uncertainty.totalUncertainty * 0.35;

    const finalCalibrated =
      this.clamp(
        rawCalibrated -
          uncertaintyPenalty,
      );

    const falseConfidencePenalty =
      this.clamp(
        heuristicProtectability -
          finalCalibrated,
      );

    return {
      scores: {
        heuristicProtectability:
          this.round(
            heuristicProtectability,
          ),

        evidenceConfidence:
          this.round(
            evidence.confidenceScore,
          ),

        verifiedPriorArtCoverage:
          this.round(
            priorArt.coverageScore,
          ),

        claimSupportCoverage:
          this.round(
            claimSupportCoverage,
          ),

        technicalValidation:
          this.round(
            technicalValidation,
          ),

        uncertainty:
          this.round(
            uncertainty.totalUncertainty,
          ),

        falseConfidencePenalty:
          this.round(
            falseConfidencePenalty,
          ),

        finalCalibratedProtectability:
          this.round(
            finalCalibrated,
          ),
      },

      findings,
    };
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
