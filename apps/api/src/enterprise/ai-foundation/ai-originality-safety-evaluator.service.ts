import { Injectable } from '@nestjs/common';

export interface AiOriginalitySafetyEvaluation {
  passed: boolean;
  originalityPassed: boolean;
  safetyPassed: boolean;
  originalityScore: number;
  duplicationScore: number;
  distinctItemCount: number;
  detectedItemCount: number;
  genericContentDetected: boolean;
  duplicatedPairs: Array<{
    firstItem: number;
    secondItem: number;
    similarity: number;
  }>;
  genericItems: number[];
  riskFlags: string[];
  warnings: string[];
  reasons: string[];
}

@Injectable()
export class AiOriginalitySafetyEvaluatorService {
  evaluate(
    request: string,
    content: string,
  ): AiOriginalitySafetyEvaluation {
    const items = this.extractIndependentItems(content);

    const duplicatedPairs =
      this.detectDuplicatedPairs(items);

    const duplicatedIndexes = new Set<number>();

    for (const pair of duplicatedPairs) {
      duplicatedIndexes.add(pair.firstItem);
      duplicatedIndexes.add(pair.secondItem);
    }

    const distinctItemCount = Math.max(
      0,
      items.length - duplicatedIndexes.size,
    );

    const duplicationScore =
      items.length > 0
        ? Math.round(
            (duplicatedIndexes.size /
              items.length) *
              100,
          )
        : 100;

    const genericItems =
      this.detectGenericItems(items);

    const genericContentDetected =
      items.length > 0 &&
      genericItems.length /
        items.length >=
        0.3;

    const originalityScore = this.calculateOriginalityScore(
      items.length,
      duplicatedIndexes.size,
      genericItems.length,
    );

    const riskFlags = this.detectSafetyRisks(
      request,
      content,
    );

    const safetyPassed =
      riskFlags.length === 0;

    const originalityPassed =
      items.length > 0 &&
      originalityScore >= 70 &&
      duplicationScore <= 30 &&
      !genericContentDetected;

    const passed =
      originalityPassed &&
      safetyPassed;

    const warnings: string[] = [];
    const reasons: string[] = [];

    if (duplicatedPairs.length > 0) {
      warnings.push(
        `تم اكتشاف ${duplicatedPairs.length} أزواج متشابهة.`,
      );
    }

    if (genericContentDetected) {
      warnings.push(
        'تم اكتشاف محتوى عام أو سطحي في نسبة مرتفعة من العناصر.',
      );
    }

    if (!safetyPassed) {
      warnings.push(
        'تم اكتشاف مخاطر سلامة تتطلب مراجعة.',
      );
    }

    if (originalityPassed) {
      reasons.push(
        'العناصر تتمتع بدرجة مقبولة من التمايز والأصالة.',
      );
    } else {
      reasons.push(
        'العناصر لا تحقق الحد الأدنى المطلوب للأصالة والتنوع.',
      );
    }

    if (safetyPassed) {
      reasons.push(
        'لم يتم اكتشاف مؤشرات خطورة مباشرة.',
      );
    }

    return {
      passed,
      originalityPassed,
      safetyPassed,
      originalityScore,
      duplicationScore,
      distinctItemCount,
      detectedItemCount: items.length,
      genericContentDetected,
      duplicatedPairs,
      genericItems,
      riskFlags,
      warnings,
      reasons,
    };
  }

  private extractIndependentItems(
    content: string,
  ): string[] {
    const normalized = content
      .replace(/\r/g, '')
      .trim();

    if (!normalized) {
      return [];
    }

    const numberedPattern =
      /(?:^|\n)\s*(?:#{1,6}\s*)?(?:\*\*)?\s*(\d{1,3})[\.\-\):،]\s*(?:\*\*)?\s*/g;

    const matches = [
      ...normalized.matchAll(
        numberedPattern,
      ),
    ];

    if (matches.length >= 2) {
      const items: string[] = [];

      for (
        let index = 0;
        index < matches.length;
        index++
      ) {
        const current = matches[index];
        const next = matches[index + 1];

        if (
          !current ||
          current.index === undefined
        ) {
          continue;
        }

        const start =
          current.index +
          current[0].length;

        const end =
          next?.index ??
          normalized.length;

        const item = normalized
          .slice(start, end)
          .replace(/^#+\s*/g, '')
          .replace(/\*\*/g, '')
          .trim();

        if (item.length >= 10) {
          items.push(item);
        }
      }

      if (items.length >= 2) {
        return items;
      }
    }

    const headingItems = normalized
      .split(
        /\n(?=(?:الفكرة|فكرة|المقترح|القناة)\s+(?:الأولى|الاولى|الثانية|الثالثة|الرابعة|الخامسة|السادسة|السابعة|الثامنة|التاسعة|العاشرة|\d+))/i,
      )
      .map((item) =>
        item
          .replace(/\*\*/g, '')
          .trim(),
      )
      .filter(
        (item) => item.length >= 10,
      );

    if (headingItems.length >= 2) {
      return headingItems;
    }

    return normalized
      .split(/\n{2,}/)
      .map((item) =>
        item
          .replace(/^#+\s*/g, '')
          .replace(/\*\*/g, '')
          .trim(),
      )
      .filter(
        (item) => item.length >= 30,
      );
  }

  private detectDuplicatedPairs(
    items: string[],
  ): Array<{
    firstItem: number;
    secondItem: number;
    similarity: number;
  }> {
    const pairs: Array<{
      firstItem: number;
      secondItem: number;
      similarity: number;
    }> = [];

    for (
      let firstIndex = 0;
      firstIndex < items.length;
      firstIndex++
    ) {
      for (
        let secondIndex =
          firstIndex + 1;
        secondIndex < items.length;
        secondIndex++
      ) {
        const similarity =
          this.calculateSimilarity(
            items[firstIndex] ?? '',
            items[secondIndex] ?? '',
          );

        if (similarity >= 55) {
          pairs.push({
            firstItem: firstIndex + 1,
            secondItem:
              secondIndex + 1,
            similarity,
          });
        }
      }
    }

    return pairs;
  }

  private calculateSimilarity(
    first: string,
    second: string,
  ): number {
    const firstTokens =
      this.toMeaningfulTokens(first);

    const secondTokens =
      this.toMeaningfulTokens(second);

    if (
      firstTokens.size === 0 ||
      secondTokens.size === 0
    ) {
      return 0;
    }

    const intersection = [
      ...firstTokens,
    ].filter((token) =>
      secondTokens.has(token),
    ).length;

    const union = new Set([
      ...firstTokens,
      ...secondTokens,
    ]).size;

    const jaccard =
      union > 0
        ? intersection / union
        : 0;

    const containment =
      intersection /
      Math.min(
        firstTokens.size,
        secondTokens.size,
      );

    return Math.round(
      (jaccard * 0.45 +
        containment * 0.55) *
        100,
    );
  }

  private toMeaningfulTokens(
    value: string,
  ): Set<string> {
    const stopWords = new Set([
      'من',
      'في',
      'على',
      'إلى',
      'الى',
      'عن',
      'مع',
      'هذا',
      'هذه',
      'ذلك',
      'التي',
      'الذي',
      'يمكن',
      'استخدام',
      'تقديم',
      'إنشاء',
      'انشاء',
      'قناة',
      'قنوات',
      'يوتيوب',
      'الذكاء',
      'الاصطناعي',
      'الاصطناعي',
      'باستخدام',
      'تستخدم',
      'تعتمد',
      'محتوى',
      'الجمهور',
      'العربي',
      'بشكل',
      'أكثر',
      'اكثر',
      'مثل',
      'حيث',
      'حول',
      'خلال',
      'وتقديم',
      'وتحليل',
      'لتحليل',
      'لإنشاء',
      'لانشاء',
    ]);

    const tokens = value
      .normalize('NFKC')
      .toLowerCase()
      .replace(
        /[\u064B-\u065F\u0670]/g,
        '',
      )
      .replace(
        /[^\p{L}\p{N}\s]/gu,
        ' ',
      )
      .split(/\s+/)
      .map((token) =>
        token.trim(),
      )
      .filter(
        (token) =>
          token.length >= 3 &&
          !stopWords.has(token),
      );

    return new Set(tokens);
  }

  private detectGenericItems(
    items: string[],
  ): number[] {
    const genericItems: number[] = [];

    const genericPatterns = [
      /تقديم محتوى قيم/i,
      /تحسين تجربة المستخدم/i,
      /حلول مبتكرة/i,
      /محتوى مفيد/i,
      /أحدث التقنيات/i,
      /معلومات دقيقة ومحدثة/i,
      /تلبية احتياجات الجمهور/i,
      /تحقيق النمو/i,
      /تعزيز التفاعل/i,
      /تجربة فريدة/i,
      /بشكل فعال/i,
      /محتوى متخصص/i,
    ];

    items.forEach((item, index) => {
      const meaningfulTokens =
        this.toMeaningfulTokens(item);

      const genericMatches =
        genericPatterns.filter(
          (pattern) =>
            pattern.test(item),
        ).length;

      const tooShort =
        meaningfulTokens.size < 8;

      const lacksMechanism =
        !/(كيف|عبر|بواسطة|من خلال|آلية|نظام|محرك|تحليل|تجربة|اختبار|مقارنة|محاكاة|توليد|تخصيص|قياس)/i.test(
          item,
        );

      if (
        genericMatches >= 2 ||
        (tooShort && lacksMechanism)
      ) {
        genericItems.push(index + 1);
      }
    });

    return genericItems;
  }

  private calculateOriginalityScore(
    itemCount: number,
    duplicatedItemCount: number,
    genericItemCount: number,
  ): number {
    if (itemCount === 0) {
      return 0;
    }

    const duplicationPenalty =
      (duplicatedItemCount /
        itemCount) *
      60;

    const genericPenalty =
      (genericItemCount /
        itemCount) *
      40;

    return Math.max(
      0,
      Math.min(
        100,
        Math.round(
          100 -
            duplicationPenalty -
            genericPenalty,
        ),
      ),
    );
  }

  private detectSafetyRisks(
    request: string,
    content: string,
  ): string[] {
    const combined =
      `${request}\n${content}`.toLowerCase();

    const riskPatterns: Array<{
      flag: string;
      pattern: RegExp;
    }> = [
      {
        flag: 'medical-diagnosis-or-treatment',
        pattern:
          /(تشخيص طبي|وصف دواء|جرعة دواء|علاج مضمون|استشارة طبية آلية)/i,
      },
      {
        flag: 'financial-guarantee',
        pattern:
          /(ربح مضمون|أرباح مضمونة|استثمار بلا مخاطر|ضمان الأرباح)/i,
      },
      {
        flag: 'privacy-or-surveillance',
        pattern:
          /(التجسس|مراقبة الأشخاص دون علمهم|سرقة البيانات|اختراق الحسابات)/i,
      },
      {
        flag: 'deceptive-content',
        pattern:
          /(انتحال شخصية|أخبار مزيفة|خداع الجمهور|تزييف الأدلة)/i,
      },
      {
        flag: 'illegal-instructions',
        pattern:
          /(تجاوز الحماية|كسر كلمات المرور|اختراق الأنظمة|تعليم السرقة)/i,
      },
    ];

    return riskPatterns
      .filter(({ pattern }) =>
        pattern.test(combined),
      )
      .map(({ flag }) => flag);
  }
}

