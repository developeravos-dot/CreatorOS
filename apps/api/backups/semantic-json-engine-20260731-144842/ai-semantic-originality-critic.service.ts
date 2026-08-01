import { Injectable } from '@nestjs/common';
import { AiCriticResult } from './ai-semantic-critic.service';
import {
  AiIdeaFingerprintExtractorService,
  IdeaFingerprint,
} from './ai-idea-fingerprint-extractor.service';

interface SemanticOriginalityInput {
  request: string;
  content: string;
  originalityEvaluation: {
    passed: boolean;
    originalityPassed: boolean;
    safetyPassed: boolean;
    originalityScore: number;
    duplicationScore: number;
    distinctItemCount: number;
    detectedItemCount: number;
    genericContentDetected: boolean;
    duplicatedPairs?: Array<{
      firstItem: number;
      secondItem: number;
      similarity: number;
    }>;
    genericItems?: number[];
    riskFlags?: string[];
    warnings?: string[];
    reasons?: string[];
  };
}

type FingerprintDimension =
  | 'domain'
  | 'audience'
  | 'contentMechanism'
  | 'aiRole'
  | 'valueProposition'
  | 'monetization'
  | 'productionStyle'
  | 'contentFormat'
  | 'goal';

interface SemanticDuplicate {
  firstItem: number;
  secondItem: number;
  similarity: number;
  matchedDimensions:
    FingerprintDimension[];
  dimensionScores:
    Record<
      FingerprintDimension,
      number
    >;
  reason: string;
}

@Injectable()
export class AiSemanticOriginalityCriticService {
  constructor(
    private readonly fingerprintExtractor:
      AiIdeaFingerprintExtractorService,
  ) {}

  async review(
    input: SemanticOriginalityInput,
  ): Promise<AiCriticResult> {
    const fingerprints =
      await this.fingerprintExtractor.extract(
        input.content,
      );

    const duplicatedConcepts:
      SemanticDuplicate[] = [];

    for (
      let firstIndex = 0;
      firstIndex <
      fingerprints.length;
      firstIndex += 1
    ) {
      for (
        let secondIndex =
          firstIndex + 1;
        secondIndex <
        fingerprints.length;
        secondIndex += 1
      ) {
        const first =
          fingerprints[firstIndex];

        const second =
          fingerprints[secondIndex];

        if (!first || !second) {
          continue;
        }

        const comparison =
          this.compareFingerprints(
            first,
            second,
          );

        /*
         * True duplication requires semantic similarity
         * in the idea's differentiating dimensions.
         *
         * Generic dimensions such as monetization or
         * production style cannot independently create
         * a duplicate decision.
         */
        const differentiatingMatches =
          comparison
            .matchedDimensions
            .filter(
              (dimension) =>
                [
                  'audience',
                  'contentMechanism',
                  'aiRole',
                  'valueProposition',
                ].includes(dimension),
            );

        const isDuplicate =
          comparison.similarity >= 82 &&
          differentiatingMatches.length >= 3;

        if (isDuplicate) {
          duplicatedConcepts.push(
            comparison,
          );
        }
      }
    }

    const incompleteItems =
      fingerprints
        .filter(
          (fingerprint) =>
            this.countDefinedDimensions(
              fingerprint,
            ) < 4,
        )
        .map(
          (fingerprint) =>
            fingerprint.itemIndex,
        );

    const legacyScore =
      input.originalityEvaluation
        .originalityScore;

    const duplicatePenalty =
      duplicatedConcepts.reduce(
        (total, duplicate) =>
          total +
          Math.max(
            8,
            Math.round(
              duplicate.similarity / 10,
            ),
          ),
        0,
      );

    const completenessPenalty =
      incompleteItems.length * 2;

    const semanticScore =
      Math.max(
        0,
        Math.min(
          100,
          legacyScore -
            duplicatePenalty -
            completenessPenalty,
        ),
      );

    const allowedDuplicates =
      Math.max(
        1,
        Math.floor(
          fingerprints.length * 0.1,
        ),
      );

    const criticalIncompleteLimit =
      Math.max(
        2,
        Math.floor(
          fingerprints.length * 0.7,
        ),
      );

    const criticalIncompleteFailure =
      incompleteItems.length >
      criticalIncompleteLimit;

    const passed =
      semanticScore >= 72 &&
      duplicatedConcepts.length <=
        allowedDuplicates &&
      !criticalIncompleteFailure;

    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (
      duplicatedConcepts.length > 0
    ) {
      warnings.push(
        `تم اكتشاف ${duplicatedConcepts.length} أزواج متشابهة دلاليًا في بنية الفكرة.`,
      );

      for (
        const duplicate of
        duplicatedConcepts.slice(0, 5)
      ) {
        recommendations.push(
          `ميّز الفكرتين ${duplicate.firstItem} و${duplicate.secondItem}: ${duplicate.reason}`,
        );
      }
    }

    if (
      incompleteItems.length > 0
    ) {
      warnings.push(
        `تحتاج بعض بصمات الأفكار إلى تفاصيل أكثر: ${incompleteItems.join(', ')}.`,
      );

      recommendations.push(
        `وضّح الجمهور وآلية المحتوى ودور الذكاء الاصطناعي والقيمة في العناصر: ${incompleteItems.join(', ')}.`,
      );
    }

    const reasons = [
      passed
        ? duplicatedConcepts.length === 0
          ? 'اجتازت الأفكار التحليل الدلالي دون اكتشاف تكرار جوهري في بنية الأفكار.'
          : 'اجتازت الأفكار التحليل الدلالي ضمن هامش التشابه المقبول.'
        : duplicatedConcepts.length >
            allowedDuplicates
          ? 'تم اكتشاف أفكار متشابهة جوهريًا في الجمهور والآلية ودور الذكاء الاصطناعي والقيمة.'
          : 'غالبية الأفكار لا تحتوي على تفاصيل كافية لتقييم تنوعها بثقة.',
    ];

    return {
      passed,
      score: semanticScore,
      confidence:
        fingerprints.length >= 5
          ? 94
          : 78,
      reasons,
      warnings: [
        ...(input.originalityEvaluation
          .warnings ?? []),
        ...warnings,
      ],
      recommendations:
        this.unique(recommendations),
      metadata: {
        engine:
          'CreatorOS LLM Semantic Fingerprint Engine',
        engineVersion: '2.0.0',
        extractionMethod:
          'local-llm-structured-json',
        fallbackAvailable: true,
        analyzedItemCount:
          fingerprints.length,
        fingerprints,
        duplicatedConcepts,
        incompleteItems,
        criticalIncompleteFailure,
        criticalIncompleteLimit,
        legacyOriginalityScore:
          legacyScore,
        semanticOriginalityScore:
          semanticScore,
        dimensions: [
          'domain',
          'audience',
          'contentMechanism',
          'aiRole',
          'valueProposition',
          'monetization',
          'productionStyle',
          'contentFormat',
          'goal',
        ],
      },
    };
  }

  private compareFingerprints(
    first: IdeaFingerprint,
    second: IdeaFingerprint,
  ): SemanticDuplicate {
    const dimensions:
      FingerprintDimension[] = [
        'domain',
        'audience',
        'contentMechanism',
        'aiRole',
        'valueProposition',
        'monetization',
        'productionStyle',
        'contentFormat',
        'goal',
      ];

    const weights:
      Record<
        FingerprintDimension,
        number
      > = {
        domain: 0.08,
        audience: 0.17,
        contentMechanism: 0.2,
        aiRole: 0.2,
        valueProposition: 0.17,
        monetization: 0.05,
        productionStyle: 0.04,
        contentFormat: 0.04,
        goal: 0.05,
      };

    const dimensionScores =
      {} as Record<
        FingerprintDimension,
        number
      >;

    const matchedDimensions:
      FingerprintDimension[] = [];

    let weightedScore = 0;
    let availableWeight = 0;

    for (const dimension of dimensions) {
      const firstValue =
        first[dimension];

      const secondValue =
        second[dimension];

      if (
        this.isUndefinedValue(
          firstValue,
        ) ||
        this.isUndefinedValue(
          secondValue,
        )
      ) {
        dimensionScores[dimension] = 0;
        continue;
      }

      const score =
        this.semanticTextSimilarity(
          firstValue,
          secondValue,
        );

      dimensionScores[dimension] =
        Math.round(score * 100);

      const weight =
        weights[dimension];

      weightedScore +=
        score * weight;

      availableWeight += weight;

      if (score >= 0.72) {
        matchedDimensions.push(
          dimension,
        );
      }
    }

    const similarity =
      availableWeight === 0
        ? 0
        : Math.round(
            Math.min(
              1,
              weightedScore /
                availableWeight,
            ) * 100,
          );

    return {
      firstItem: first.itemIndex,
      secondItem: second.itemIndex,
      similarity,
      matchedDimensions,
      dimensionScores,
      reason:
        matchedDimensions.length > 0
          ? `تشابهت البصمة في: ${matchedDimensions.join(', ')}.`
          : 'لم يتم اكتشاف تشابه جوهري.',
    };
  }

  private semanticTextSimilarity(
    firstValue: string,
    secondValue: string,
  ): number {
    const firstTokens =
      this.tokenize(firstValue);

    const secondTokens =
      this.tokenize(secondValue);

    if (
      firstTokens.length === 0 ||
      secondTokens.length === 0
    ) {
      return 0;
    }

    const first =
      new Set(firstTokens);

    const second =
      new Set(secondTokens);

    const intersection =
      [...first].filter(
        (token) =>
          second.has(token),
      ).length;

    const union =
      new Set([
        ...first,
        ...second,
      ]).size;

    const containment =
      intersection /
      Math.min(
        first.size,
        second.size,
      );

    const jaccard =
      union === 0
        ? 0
        : intersection / union;

    return Math.min(
      1,
      containment * 0.65 +
        jaccard * 0.35,
    );
  }

  private tokenize(
    value: string,
  ): string[] {
    const stopWords =
      new Set([
        'في',
        'من',
        'على',
        'الى',
        'إلى',
        'عن',
        'مع',
        'عبر',
        'يستخدم',
        'استخدام',
        'تقديم',
        'يقدم',
        'الذكاء',
        'الاصطناعي',
        'قناة',
        'قناه',
        'محتوى',
        'غير',
        'محدد',
      ]);

    return this.normalizeText(value)
      .split(/\s+/)
      .filter(
        (token) =>
          token.length >= 3 &&
          !stopWords.has(token),
      );
  }

  private normalizeText(
    value: string,
  ): string {
    return value
      .toLowerCase()
      .normalize('NFKD')
      .replace(
        /[\u064B-\u065F\u0670]/g,
        '',
      )
      .replace(/[إأآ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      .replace(
        /[^\p{L}\p{N}\s]/gu,
        ' ',
      )
      .replace(/\s+/g, ' ')
      .trim();
  }

  private countDefinedDimensions(
    fingerprint: IdeaFingerprint,
  ): number {
    const values = [
      fingerprint.domain,
      fingerprint.audience,
      fingerprint.contentMechanism,
      fingerprint.aiRole,
      fingerprint.valueProposition,
      fingerprint.monetization,
      fingerprint.productionStyle,
      fingerprint.contentFormat,
      fingerprint.goal,
    ];

    return values.filter(
      (value) =>
        !this.isUndefinedValue(
          value,
        ),
    ).length;
  }

  private isUndefinedValue(
    value: string,
  ): boolean {
    const normalized =
      this.normalizeText(
        value ?? '',
      );

    return (
      normalized.length === 0 ||
      normalized === 'غير محدد' ||
      normalized ===
        'not specified' ||
      normalized === 'unknown'
    );
  }

  private unique<T>(
    values: T[],
  ): T[] {
    return [...new Set(values)];
  }
}
