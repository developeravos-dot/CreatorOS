import { Injectable } from '@nestjs/common';
import { IntelligenceRouterService } from '../intelligence/intelligence-router.service';
import { AiTaskType } from './dto/execute-ai-task.dto';

export interface SemanticValidationResult {
  passed: boolean;
  confidence: number;
  requiredItemCount?: number;
  detectedIndependentItemCount?: number;
  everyItemSatisfiesCoreRequirement: boolean;
  structureValid: boolean;
  languageValid: boolean;
  missingRequirements: string[];
  reasons: string[];
  validatorProvider: string;
  validatorModel: string;
  parseSucceeded: boolean;
}

interface RawValidatorResponse {
  passed?: boolean;
  confidence?: number;
  requiredItemCount?: number;
  detectedIndependentItemCount?: number;
  everyItemSatisfiesCoreRequirement?: boolean;
  structureValid?: boolean;
  languageValid?: boolean;
  missingRequirements?: unknown;
  reasons?: unknown;
}

@Injectable()
export class AiSemanticValidatorService {
  constructor(
    private readonly intelligence: IntelligenceRouterService,
  ) {}

  async validate(input: {
    taskType: AiTaskType;
    originalRequest: string;
    generatedContent: string;
    language?: string;
    provider: 'auto' | 'local' | 'openai' | 'mock';
    model: string;
    allowPaidProvider: boolean;
  }): Promise<SemanticValidationResult> {
    const requiredItemCount =
      this.extractRequestedCount(input.originalRequest);

    const prompt = this.buildValidationPrompt({
      taskType: input.taskType,
      originalRequest: input.originalRequest,
      generatedContent: input.generatedContent,
      language: input.language,
      requiredItemCount,
    });

    const validationResult =
      await this.intelligence.generate({
        prompt,
        systemPrompt:
          'You are CreatorOS Semantic Response Validator. Evaluate compliance strictly. Return one valid JSON object only. Do not include markdown or commentary.',
        provider: input.provider,
        model: input.model,
        temperature: 0.1,
        maxTokens: 900,
        allowPaidProvider: input.allowPaidProvider,
        metadata: {
          aiFoundation: true,
          semanticValidation: true,
          taskType: input.taskType,
        },
      });

    const parsed = this.parseJson(
      validationResult.content,
    );

    if (!parsed) {
      return {
        passed: false,
        confidence: 0,
        requiredItemCount,
        detectedIndependentItemCount: 0,
        everyItemSatisfiesCoreRequirement: false,
        structureValid: false,
        languageValid: false,
        missingRequirements: [
          'Semantic validator returned invalid JSON.',
        ],
        reasons: [
          'The validator output could not be parsed safely.',
        ],
        validatorProvider: validationResult.provider,
        validatorModel: validationResult.model,
        parseSucceeded: false,
      };
    }

    const detectedIndependentItemCount =
      this.toSafeInteger(
        parsed.detectedIndependentItemCount,
        0,
      );

    const everyItemSatisfiesCoreRequirement =
      parsed.everyItemSatisfiesCoreRequirement === true;

    const structureValid =
      parsed.structureValid === true;

    const languageValid =
      parsed.languageValid !== false;

    const countSatisfied =
      requiredItemCount === undefined ||
      detectedIndependentItemCount >= requiredItemCount;

    const objectiveChecksPassed =
      countSatisfied &&
      everyItemSatisfiesCoreRequirement &&
      structureValid &&
      languageValid;

    const passed =
      objectiveChecksPassed;

    return {
      passed,
      confidence: this.resolveConfidence(
        parsed.confidence,
        {
          countSatisfied,
          everyItemSatisfiesCoreRequirement,
          structureValid,
          languageValid,
          parseSucceeded: true,
        },
      ),
      requiredItemCount,
      detectedIndependentItemCount,
      everyItemSatisfiesCoreRequirement,
      structureValid,
      languageValid,
      missingRequirements:
        this.toStringArray(
          parsed.missingRequirements,
        ),
      reasons:
        this.toStringArray(parsed.reasons),
      validatorProvider: validationResult.provider,
      validatorModel: validationResult.model,
      parseSucceeded: true,
    };
  }

  buildCorrectionPrompt(input: {
    originalRequest: string;
    failedContent: string;
    validation: SemanticValidationResult;
    language?: string;
  }): string {
    const requiredCount =
      input.validation.requiredItemCount;

    return [
      'The previous response failed semantic validation.',
      '',
      'ORIGINAL REQUEST:',
      input.originalRequest,
      '',
      'FAILED RESPONSE:',
      input.failedContent,
      '',
      'VALIDATION FAILURE:',
      `Detected independent items: ${input.validation.detectedIndependentItemCount ?? 0}`,
      `Required independent items: ${requiredCount ?? 'not specified'}`,
      `Every item satisfies the core requirement: ${input.validation.everyItemSatisfiesCoreRequirement}`,
      `Structure valid: ${input.validation.structureValid}`,
      `Language valid: ${input.validation.languageValid}`,
      `Missing requirements: ${
        input.validation.missingRequirements.join('; ') ||
        'unspecified'
      }`,
      `Reasons: ${
        input.validation.reasons.join('; ') ||
        'unspecified'
      }`,
      '',
      'REWRITE RULES:',
      '1. Rewrite the entire answer from zero.',
      requiredCount !== undefined
        ? `2. Return exactly ${requiredCount} independent top-level items.`
        : '2. Return all independently requested items.',
      '3. Number only the top-level requested items.',
      '4. Do not number substeps, benefits, examples or internal details.',
      '5. Give every top-level item a unique title.',
      '6. Make every top-level item independently usable.',
      '7. Ensure every item directly satisfies the central requirement.',
      '8. Do not combine multiple requested items into one concept.',
      input.language
        ? `9. Write the entire answer only in ${input.language}.`
        : '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  getStatus() {
    return {
      success: true,
      validator: 'semantic-ai-response-validator',
      strictJsonOutput: true,
      validates: [
        'independent-item-count',
        'core-requirement-per-item',
        'response-structure',
        'requested-language',
        'overall-semantic-compliance',
      ],
    };
  }

  private buildValidationPrompt(input: {
    taskType: AiTaskType;
    originalRequest: string;
    generatedContent: string;
    language?: string;
    requiredItemCount?: number;
  }): string {
    return [
      'Evaluate whether the generated response fully satisfies the original request.',
      '',
      'IMPORTANT VALIDATION RULES:',
      '- Count only independent top-level requested outputs.',
      '- Do not count substeps, features, benefits, headings or numbered paragraphs as separate requested outputs.',
      '- For an ideas request, every counted item must be a genuinely separate idea.',
      '- Every counted item must satisfy the central requirement of the request.',
      '- Be strict. Do not pass partially compliant output.',
      '',
      `Task type: ${input.taskType}`,
      `Requested language: ${input.language ?? 'automatic'}`,
      `Required independent item count: ${input.requiredItemCount ?? 'not explicitly specified'}`,
      '',
      'ORIGINAL REQUEST:',
      input.originalRequest,
      '',
      'GENERATED RESPONSE:',
      input.generatedContent,
      '',
      'Return JSON using exactly this structure:',
      JSON.stringify(
        {
          passed: false,
          confidence: 0,
          requiredItemCount:
            input.requiredItemCount ?? null,
          detectedIndependentItemCount: 0,
          everyItemSatisfiesCoreRequirement: false,
          structureValid: false,
          languageValid: false,
          missingRequirements: [
            'Describe every missing requirement.',
          ],
          reasons: [
            'Explain the validation decision briefly.',
          ],
        },
        null,
        2,
      ),
      '',
      'Return JSON only.',
    ].join('\n');
  }

  private parseJson(
    content: string,
  ): RawValidatorResponse | undefined {
    const cleaned = content
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    try {
      return JSON.parse(
        cleaned,
      ) as RawValidatorResponse;
    } catch {
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');

      if (
        firstBrace === -1 ||
        lastBrace === -1 ||
        lastBrace <= firstBrace
      ) {
        return undefined;
      }

      try {
        return JSON.parse(
          cleaned.slice(
            firstBrace,
            lastBrace + 1,
          ),
        ) as RawValidatorResponse;
      } catch {
        return undefined;
      }
    }
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

  private resolveConfidence(
    rawConfidence: unknown,
    checks: {
      countSatisfied: boolean;
      everyItemSatisfiesCoreRequirement: boolean;
      structureValid: boolean;
      languageValid: boolean;
      parseSucceeded: boolean;
    },
  ): number {
    const parsedConfidence =
      Number(rawConfidence);

    if (
      Number.isFinite(parsedConfidence) &&
      parsedConfidence > 0
    ) {
      if (parsedConfidence <= 1) {
        return Math.round(
          parsedConfidence * 100,
        );
      }

      return Math.min(
        100,
        Math.round(parsedConfidence),
      );
    }

    let confidence = 0;

    if (checks.parseSucceeded) {
      confidence += 15;
    }

    if (checks.countSatisfied) {
      confidence += 25;
    }

    if (
      checks.everyItemSatisfiesCoreRequirement
    ) {
      confidence += 25;
    }

    if (checks.structureValid) {
      confidence += 20;
    }

    if (checks.languageValid) {
      confidence += 15;
    }

    return confidence;
  }

  private toStringArray(
    value: unknown,
  ): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter(
        (item): item is string =>
          typeof item === 'string',
      )
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private toSafeInteger(
    value: unknown,
    fallback: number,
  ): number {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      return fallback;
    }

    return Math.max(
      0,
      Math.floor(parsed),
    );
  }

  private toSafeNumber(
    value: unknown,
    minimum: number,
    maximum: number,
    fallback: number,
  ): number {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      return fallback;
    }

    return Math.min(
      maximum,
      Math.max(minimum, parsed),
    );
  }
}




