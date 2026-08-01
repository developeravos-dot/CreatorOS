import { Injectable } from '@nestjs/common';
import { AiTaskType } from './dto/execute-ai-task.dto';

export interface AiQualityAssessment {
  passed: boolean;
  score: number;
  checks: {
    nonEmpty: boolean;
    minimumLength: boolean;
    languageMatched: boolean;
    requestTermsCovered: boolean;
    requestedCountSatisfied: boolean;
    mockResult: boolean;
  };
  requestedCount?: number;
  detectedItemCount?: number;
  missingTerms: string[];
  warnings: string[];
}

@Injectable()
export class AiQualityGateService {
  assess(input: {
    taskType: AiTaskType;
    request: string;
    content: string;
    language?: string;
    provider: string;
  }): AiQualityAssessment {
    const request = input.request.toLowerCase();
    const content = input.content.toLowerCase();

    const importantTerms = this.extractImportantTerms(request);

    const missingTerms = importantTerms.filter(
      (term) => !content.includes(term),
    );

    const nonEmpty = content.trim().length > 0;
    const minimumLength = content.trim().length >= 120;

    const mockResult =
      input.provider === 'mock' ||
      content.includes('[mock result]');

    const languageMatched =
      !input.language ||
      input.language.toLowerCase() !== 'arabic' ||
      this.containsArabic(content);

    const requestTermsCovered =
      importantTerms.length === 0 ||
      missingTerms.length <=
        Math.floor(importantTerms.length * 0.5);

    const requestedCount =
      this.extractRequestedCount(request);

    const detectedItemCount =
      requestedCount !== undefined
        ? this.detectNumberedItems(input.content)
        : undefined;

    const requestedCountSatisfied =
      requestedCount === undefined ||
      (detectedItemCount !== undefined &&
        detectedItemCount >= requestedCount);

    let score = 0;

    if (nonEmpty) score += 15;
    if (minimumLength) score += 15;
    if (languageMatched) score += 15;
    if (requestTermsCovered) score += 25;
    if (requestedCountSatisfied) score += 20;
    if (!mockResult) score += 10;

    const warnings: string[] = [];

    if (!nonEmpty) {
      warnings.push('AI returned empty content.');
    }

    if (!minimumLength) {
      warnings.push('AI result is shorter than expected.');
    }

    if (!languageMatched) {
      warnings.push(
        'AI result does not match the requested language.',
      );
    }

    if (!requestTermsCovered) {
      warnings.push(
        `AI result may not satisfy the core request. Missing terms: ${missingTerms.join(', ')}`,
      );
    }

    if (!requestedCountSatisfied) {
      warnings.push(
        `AI returned ${detectedItemCount ?? 0} structured items, but ${requestedCount} were requested.`,
      );
    }

    if (mockResult) {
      warnings.push(
        'Mock provider result cannot pass production quality.',
      );
    }

    return {
      passed:
        score >= 70 &&
        nonEmpty &&
        languageMatched &&
        requestTermsCovered &&
        requestedCountSatisfied &&
        !mockResult,
      score,
      checks: {
        nonEmpty,
        minimumLength,
        languageMatched,
        requestTermsCovered,
        requestedCountSatisfied,
        mockResult,
      },
      requestedCount,
      detectedItemCount,
      missingTerms,
      warnings,
    };
  }

  buildCorrectionPrompt(input: {
    originalRequest: string;
    failedContent: string;
    assessment: AiQualityAssessment;
    language?: string;
  }): string {
    const countRequirement =
      input.assessment.requestedCount !== undefined
        ? `You must return exactly ${input.assessment.requestedCount} clearly numbered items.`
        : '';

    return [
      'The previous response did not fully satisfy the request.',
      '',
      'Original request:',
      input.originalRequest,
      '',
      'Previous response:',
      input.failedContent,
      '',
      `Quality score: ${input.assessment.score}/100`,
      `Missing requirements: ${
        input.assessment.missingTerms.join(', ') ||
        'structural or numerical requirements'
      }`,
      '',
      'Rewrite the response completely.',
      'Strictly satisfy every requirement in the original request.',
      'Do not reuse generic ideas that ignore the main subject.',
      'Make every item directly connected to the requested topic.',
      countRequirement,
      input.language
        ? `Write only in ${input.language}.`
        : '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  private extractRequestedCount(
    request: string,
  ): number | undefined {
    const normalizedRequest = request
      .normalize('NFKC')
      .replace(/[\u064B-\u065F\u0670]/g, '')
      .replace(/[٠-٩]/g, (digit) => {
        const digits = '٠١٢٣٤٥٦٧٨٩';
        return String(digits.indexOf(digit));
      })
      .replace(/\s+/g, ' ')
      .trim();

    const explicitCount =
      normalizedRequest.match(
        /(?:^|\D)([1-9]\d{0,2})(?=\D|$)/,
      );

    const explicitValue =
      explicitCount?.[1];

    if (explicitValue) {
      const parsed = Number(explicitValue);

      if (
        Number.isInteger(parsed) &&
        parsed > 0 &&
        parsed <= 999
      ) {
        return parsed;
      }
    }

    const numberWords: Record<string, number> = {
      اثنان: 2,
      اثنين: 2,
      اثنتان: 2,
      ثلاثة: 3,
      ثلاث: 3,
      أربعة: 4,
      اربعة: 4,
      أربع: 4,
      اربع: 4,
      خمسة: 5,
      خمس: 5,
      ستة: 6,
      ست: 6,
      سبعة: 7,
      سبع: 7,
      ثمانية: 8,
      ثمان: 8,
      تسعة: 9,
      تسع: 9,
      عشرة: 10,
      عشر: 10,
      عشرون: 20,
      عشرين: 20,
    };

    for (const [word, value] of Object.entries(
      numberWords,
    )) {
      if (normalizedRequest.includes(word)) {
        return value;
      }
    }

    return undefined;
  }

  private detectNumberedItems(
    content: string,
  ): number {
    const matches = content.match(
      /(?:^|\n)\s*(?:\d{1,3}|[٠-٩]{1,3})[\.\-\)]\s+/g,
    );

    if (!matches) {
      return 0;
    }

    return matches.length;
  }

  private extractImportantTerms(request: string): string[] {
    const knownTerms = [
      'artificial intelligence',
      'ai',
      'ذكاء اصطناعي',
      'الذكاء الاصطناعي',
      'youtube',
      'يوتيوب',
      'arabic',
      'عربي',
      'العربي',
      'channel',
      'قناة',
      'original',
      'أصلية',
      'scalable',
      'قابلة للتوسع',
    ];

    return Array.from(
      new Set(
        knownTerms.filter((term) =>
          request.includes(term),
        ),
      ),
    );
  }

  private containsArabic(value: string): boolean {
    return /[\u0600-\u06FF]/.test(value);
  }

  getStatus() {
    return {
      success: true,
      minimumPassingScore: 70,
      automaticCorrectionEnabled: true,
      checks: [
        'non-empty',
        'minimum-length',
        'language-match',
        'request-term-coverage',
        'requested-count-satisfaction',
        'non-mock-production-result',
      ],
    };
  }
}

