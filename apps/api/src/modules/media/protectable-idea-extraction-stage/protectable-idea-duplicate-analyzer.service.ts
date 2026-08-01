import { Injectable } from '@nestjs/common';

export type DuplicateSeverity =
  | 'none'
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface DuplicateDimensionScores {
  [dimension: string]: number;
}

export interface DuplicateConceptInput {
  firstItem: number;
  secondItem: number;
  similarity: number;
  matchedDimensions?: string[];
  dimensionScores?: DuplicateDimensionScores;
  reason?: string;
  detectionMethod?: string;
}

export interface DuplicateAnalysisInput {
  duplicatedConcepts?: DuplicateConceptInput[];
  fingerprints?: Array<Record<string, unknown>>;
  semanticOriginalityScore?: number;
  analyzedItemCount?: number;
  sourceContent?: string;
}

export interface DuplicatePairAnalysis {
  firstItem: number;
  secondItem: number;
  similarity: number;
  severity: DuplicateSeverity;
  matchedDimensions: string[];
  strongestDimensions: string[];
  weakDifferentiationDimensions: string[];
  reason: string;
  detectionMethod: string;
  requiredAction:
    | 'none'
    | 'minor-differentiation'
    | 'structural-differentiation'
    | 'major-rebuild'
    | 'complete-reinvention';
}

export interface DuplicateAnalyzerResult {
  success: true;
  engine: 'CreatorOS Protectable Idea Duplicate Analyzer';
  engineVersion: '2.0.0';
  strategy: 'hybrid-deterministic-semantic';
  hasDuplicates: boolean;
  overallSeverity: DuplicateSeverity;
  duplicatePairCount: number;
  analyzedItemCount: number;
  originalityScore: number;
  pairs: DuplicatePairAnalysis[];
  affectedItems: number[];
  dimensionsNeedingInnovation: string[];
  detectionMethods: string[];
  nextStage:
    | 'protectable-idea-novelty-generation'
    | 'completed';
  summary: string;
}

interface ParsedIdea {
  index: number;
  original: string;
  normalized: string;
  tokens: string[];
}

@Injectable()
export class ProtectableIdeaDuplicateAnalyzerService {
  analyze(
    input: DuplicateAnalysisInput,
  ): DuplicateAnalyzerResult {
    const semanticDuplicates = Array.isArray(
      input.duplicatedConcepts,
    )
      ? input.duplicatedConcepts
      : [];

    const deterministicDuplicates =
      this.detectFromSourceContent(
        input.sourceContent ?? '',
      );

    const duplicatedConcepts = this.mergeDuplicates([
      ...semanticDuplicates,
      ...deterministicDuplicates,
    ]);

    const pairs = duplicatedConcepts.map((duplicate) =>
      this.analyzePair(duplicate),
    );

    const affectedItems = [
      ...new Set(
        pairs.flatMap((pair) => [
          pair.firstItem,
          pair.secondItem,
        ]),
      ),
    ].sort((a, b) => a - b);

    const dimensionsNeedingInnovation = [
      ...new Set(
        pairs.flatMap(
          (pair) => pair.strongestDimensions,
        ),
      ),
    ];

    const detectionMethods = [
      ...new Set(
        pairs.map((pair) => pair.detectionMethod),
      ),
    ];

    const parsedIdeas = this.parseIdeas(
      input.sourceContent ?? '',
    );

    const analyzedItemCount = Math.max(
      this.normalizeNumber(
        input.analyzedItemCount,
        0,
      ),
      Array.isArray(input.fingerprints)
        ? input.fingerprints.length
        : 0,
      parsedIdeas.length,
    );

    const overallSeverity =
      this.calculateOverallSeverity(pairs);

    const computedOriginalityScore =
      this.calculateOriginalityScore(
        analyzedItemCount,
        pairs,
      );

    const suppliedOriginalityScore =
      this.normalizeNumber(
        input.semanticOriginalityScore,
        computedOriginalityScore,
      );

    const originalityScore =
      pairs.length > 0
        ? Math.min(
            suppliedOriginalityScore,
            computedOriginalityScore,
          )
        : suppliedOriginalityScore;

    const hasDuplicates = pairs.length > 0;

    return {
      success: true,
      engine:
        'CreatorOS Protectable Idea Duplicate Analyzer',
      engineVersion: '2.0.0',
      strategy: 'hybrid-deterministic-semantic',
      hasDuplicates,
      overallSeverity,
      duplicatePairCount: pairs.length,
      analyzedItemCount,
      originalityScore,
      pairs,
      affectedItems,
      dimensionsNeedingInnovation,
      detectionMethods,
      nextStage: hasDuplicates
        ? 'protectable-idea-novelty-generation'
        : 'completed',
      summary: this.buildSummary(
        pairs.length,
        overallSeverity,
        affectedItems,
        detectionMethods,
      ),
    };
  }

  analyzeCriticResult(
    criticResult: unknown,
    sourceContent = '',
  ): DuplicateAnalyzerResult {
    const root = this.asRecord(criticResult);
    const result = this.asRecord(root.result);

    const metadataCandidates = [
      this.asRecord(root.metadata),
      this.asRecord(result.metadata),
      this.asRecord(root.data),
      this.asRecord(
        this.asRecord(root.data).metadata,
      ),
    ];

    const duplicatedConcepts =
      this.firstDuplicateCollection(
        metadataCandidates,
      );

    const fingerprints =
      this.firstArrayValue(
        metadataCandidates,
        'fingerprints',
      );

    const semanticOriginalityScore =
      this.firstNumberValue(
        metadataCandidates,
        'semanticOriginalityScore',
      ) ??
      this.firstNumberValue(
        metadataCandidates,
        'originalityScore',
      );

    const analyzedItemCount =
      this.firstNumberValue(
        metadataCandidates,
        'analyzedItemCount',
      );

    return this.analyze({
      duplicatedConcepts,
      fingerprints:
        fingerprints as Array<Record<string, unknown>>,
      semanticOriginalityScore,
      analyzedItemCount,
      sourceContent,
    });
  }

  private detectFromSourceContent(
    sourceContent: string,
  ): DuplicateConceptInput[] {
    const ideas = this.parseIdeas(sourceContent);
    const duplicates: DuplicateConceptInput[] = [];

    for (
      let first = 0;
      first < ideas.length;
      first += 1
    ) {
      for (
        let second = first + 1;
        second < ideas.length;
        second += 1
      ) {
        const firstIdea = ideas[first];
        const secondIdea = ideas[second];

        if (!firstIdea || !secondIdea) {
          continue;
        }

        const exact =
          firstIdea.normalized ===
          secondIdea.normalized;

        const tokenSimilarity =
          this.jaccardSimilarity(
            firstIdea.tokens,
            secondIdea.tokens,
          );

        const containment =
          this.tokenContainment(
            firstIdea.tokens,
            secondIdea.tokens,
          );

        const characterSimilarity =
          this.characterSimilarity(
            firstIdea.normalized,
            secondIdea.normalized,
          );

        let similarity = Math.round(
          tokenSimilarity * 50 +
            containment * 30 +
            characterSimilarity * 20,
        );

        let detectionMethod =
          'deterministic-hybrid-similarity';

        if (exact) {
          similarity = 100;
          detectionMethod =
            'deterministic-exact-match';
        }

        if (similarity < 65) {
          continue;
        }

        duplicates.push({
          firstItem: firstIdea.index,
          secondItem: secondIdea.index,
          similarity,
          matchedDimensions: [
            'normalizedText',
            'coreVocabulary',
            'contentMechanism',
            'goal',
          ],
          dimensionScores: {
            normalizedText: exact
              ? 100
              : Math.round(
                  characterSimilarity * 100,
                ),
            coreVocabulary: Math.round(
              tokenSimilarity * 100,
            ),
            contentMechanism: Math.round(
              containment * 100,
            ),
            goal: similarity,
          },
          reason: exact
            ? 'Ã˜ÂªÃ™â€¦ Ã˜Â§Ã™Æ’Ã˜ÂªÃ˜Â´Ã˜Â§Ã™Â Ã˜ÂªÃ˜Â·Ã˜Â§Ã˜Â¨Ã™â€š Ã™â€ Ã˜ÂµÃ™Å  Ã™Æ’Ã˜Â§Ã™â€¦Ã™â€ž Ã˜Â¨Ã˜Â¹Ã˜Â¯ Ã˜ÂªÃ™Ë†Ã˜Â­Ã™Å Ã˜Â¯ Ã˜Â§Ã™â€žÃ™â€ Ã˜Âµ.'
            : `Ã˜ÂªÃ™â€¦ Ã˜Â§Ã™Æ’Ã˜ÂªÃ˜Â´Ã˜Â§Ã™Â Ã˜ÂªÃ˜Â´Ã˜Â§Ã˜Â¨Ã™â€¡ Ã˜Â­Ã˜ÂªÃ™â€¦Ã™Å  Ã˜Â¨Ã™â€ Ã˜Â³Ã˜Â¨Ã˜Â© ${similarity}% Ã™â€¦Ã™â€  Ã˜Â®Ã™â€žÃ˜Â§Ã™â€ž Ã™â€¦Ã™â€šÃ˜Â§Ã˜Â±Ã™â€ Ã˜Â© Ã˜Â§Ã™â€žÃ™â€¦Ã™ÂÃ˜Â±Ã˜Â¯Ã˜Â§Ã˜Âª Ã™Ë†Ã˜Â§Ã™â€žÃ˜Â¨Ã™â€ Ã™Å Ã˜Â© Ã˜Â§Ã™â€žÃ™â€ Ã˜ÂµÃ™Å Ã˜Â© Ã™Ë†Ã˜Â§Ã™â€žÃ˜Â§Ã˜Â­Ã˜ÂªÃ™Ë†Ã˜Â§Ã˜Â¡ Ã˜Â§Ã™â€žÃ˜Â¯Ã™â€žÃ˜Â§Ã™â€žÃ™Å .`,
          detectionMethod,
        });
      }
    }

    return duplicates;
  }

  private parseIdeas(
    sourceContent: string,
  ): ParsedIdea[] {
    if (!sourceContent.trim()) {
      return [];
    }

    const lines = sourceContent
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const numberedIdeas: ParsedIdea[] = [];

    for (const line of lines) {
      const match = line.match(
        /^(?:Ã˜Â§Ã™â€žÃ™ÂÃ™Æ’Ã˜Â±Ã˜Â©\s*)?(\d+)\s*[\.\-\):Ã˜Å’]\s*(.+)$/u,
      );

      if (!match) {
        continue;
      }

      const matchedContent = match[2];

      if (!matchedContent) {
        continue;
      }

      const original = matchedContent.trim();
      const normalized =
        this.normalizeArabicText(original);

      if (!normalized) {
        continue;
      }

      numberedIdeas.push({
        index: Number(match[1]),
        original,
        normalized,
        tokens: this.tokenize(normalized),
      });
    }

    if (numberedIdeas.length >= 2) {
      return numberedIdeas;
    }

    const paragraphs = sourceContent
      .split(/\r?\n\s*\r?\n/)
      .map((paragraph) =>
        paragraph
          .replace(
            /^(?:Ã˜Â§Ã™â€žÃ™ÂÃ™Æ’Ã˜Â±Ã˜Â©\s*)?\d+\s*[\.\-\):Ã˜Å’]\s*/u,
            '',
          )
          .trim(),
      )
      .filter(Boolean);

    if (paragraphs.length < 2) {
      return numberedIdeas;
    }

    return paragraphs.map((original, position) => {
      const normalized =
        this.normalizeArabicText(original);

      return {
        index: position + 1,
        original,
        normalized,
        tokens: this.tokenize(normalized),
      };
    });
  }

  private normalizeArabicText(
    value: string,
  ): string {
    return value
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u064B-\u065F\u0670]/gu, '')
      .replace(/[Ã˜Â¥Ã˜Â£Ã˜Â¢Ã™Â±]/gu, 'Ã˜Â§')
      .replace(/Ã™â€°/gu, 'Ã™Å ')
      .replace(/Ã˜Â¤/gu, 'Ã™Ë†')
      .replace(/Ã˜Â¦/gu, 'Ã™Å ')
      .replace(/Ã˜Â©/gu, 'Ã™â€¡')
      .replace(/Ã™â‚¬/gu, '')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/gu, ' ')
      .trim();
  }

  private tokenize(
    normalizedText: string,
  ): string[] {
    const stopWords = new Set([
      'Ã™ÂÃ™Å ',
      'Ã™â€¦Ã™â€ ',
      'Ã˜Â§Ã™â€žÃ™â€°',
      'Ã˜Â¹Ã™â€žÃ™â€°',
      'Ã˜Â¹Ã™â€ ',
      'Ã™â€¦Ã˜Â¹',
      'Ã˜Â§Ã™Ë†',
      'Ã™Ë†',
      'Ã˜Â«Ã™â€¦',
      'Ã™â€¡Ã˜Â°Ã˜Â§',
      'Ã™â€¡Ã˜Â°Ã™â€¡',
      'Ã˜Â§Ã™â€žÃ˜ÂªÃ™Å ',
      'Ã˜Â§Ã™â€žÃ˜Â°Ã™Å ',
      'Ã™Æ’Ã™â€ž',
      'Ã˜Â¨Ã™Å Ã™â€ ',
      'Ã˜Â¯Ã˜Â§Ã˜Â®Ã™â€ž',
      'Ã˜ÂªÃ˜Â³Ã˜ÂªÃ˜Â®Ã˜Â¯Ã™â€¦',
      'Ã™Å Ã™â€šÃ™Ë†Ã™â€¦',
      'Ã˜ÂªÃ™â€šÃ™Ë†Ã™â€¦',
      'Ã™â€šÃ™â€ Ã˜Â§Ã™â€¡',
    ]);

    return [
      ...new Set(
        normalizedText
          .split(/\s+/u)
          .filter(
            (token) =>
              token.length > 1 &&
              !stopWords.has(token),
          ),
      ),
    ];
  }

  private jaccardSimilarity(
    firstTokens: string[],
    secondTokens: string[],
  ): number {
    const first = new Set(firstTokens);
    const second = new Set(secondTokens);

    const union = new Set([
      ...first,
      ...second,
    ]);

    if (union.size === 0) {
      return 0;
    }

    let intersection = 0;

    for (const token of first) {
      if (second.has(token)) {
        intersection += 1;
      }
    }

    return intersection / union.size;
  }

  private tokenContainment(
    firstTokens: string[],
    secondTokens: string[],
  ): number {
    const first = new Set(firstTokens);
    const second = new Set(secondTokens);

    const minimumSize = Math.min(
      first.size,
      second.size,
    );

    if (minimumSize === 0) {
      return 0;
    }

    let shared = 0;

    for (const token of first) {
      if (second.has(token)) {
        shared += 1;
      }
    }

    return shared / minimumSize;
  }

  private characterSimilarity(
    first: string,
    second: string,
  ): number {
    if (!first || !second) {
      return 0;
    }

    if (first === second) {
      return 1;
    }

    const distance =
      this.levenshteinDistance(first, second);

    return Math.max(
      0,
      1 -
        distance /
          Math.max(first.length, second.length),
    );
  }

  private levenshteinDistance(
    first: string,
    second: string,
  ): number {
    const previous: number[] = Array.from(
      { length: second.length + 1 },
      (_, index) => index,
    );

    for (
      let firstIndex = 1;
      firstIndex <= first.length;
      firstIndex += 1
    ) {
      const current: number[] = Array(
        second.length + 1,
      ).fill(0);

      current[0] = firstIndex;

      for (
        let secondIndex = 1;
        secondIndex <= second.length;
        secondIndex += 1
      ) {
        const substitutionCost =
          first.charAt(firstIndex - 1) ===
          second.charAt(secondIndex - 1)
            ? 0
            : 1;

        const left =
          current[secondIndex - 1] ?? 0;

        const above =
          previous[secondIndex] ?? 0;

        const diagonal =
          previous[secondIndex - 1] ?? 0;

        current[secondIndex] = Math.min(
          left + 1,
          above + 1,
          diagonal + substitutionCost,
        );
      }

      for (
        let index = 0;
        index < current.length;
        index += 1
      ) {
        previous[index] =
          current[index] ?? 0;
      }
    }

    return previous[second.length] ?? 0;
  }

  private mergeDuplicates(
    duplicates: DuplicateConceptInput[],
  ): DuplicateConceptInput[] {
    const merged = new Map<
      string,
      DuplicateConceptInput
    >();

    for (const duplicate of duplicates) {
      const firstItem = Math.min(
        duplicate.firstItem,
        duplicate.secondItem,
      );

      const secondItem = Math.max(
        duplicate.firstItem,
        duplicate.secondItem,
      );

      if (
        firstItem <= 0 ||
        secondItem <= 0 ||
        firstItem === secondItem
      ) {
        continue;
      }

      const key = `${firstItem}:${secondItem}`;
      const existing = merged.get(key);

      if (
        !existing ||
        duplicate.similarity >
          existing.similarity
      ) {
        merged.set(key, {
          ...duplicate,
          firstItem,
          secondItem,
        });
      }
    }

    return [...merged.values()];
  }

  private analyzePair(
    duplicate: DuplicateConceptInput,
  ): DuplicatePairAnalysis {
    const similarity = this.clamp(
      this.normalizeNumber(
        duplicate.similarity,
        0,
      ),
      0,
      100,
    );

    const severity =
      this.classifySeverity(similarity);

    const dimensionScores =
      duplicate.dimensionScores ?? {};

    const matchedDimensions = Array.isArray(
      duplicate.matchedDimensions,
    )
      ? duplicate.matchedDimensions
      : [];

    const strongestDimensions = Object.entries(
      dimensionScores,
    )
      .filter(([, score]) => score >= 75)
      .sort((first, second) =>
        second[1] - first[1],
      )
      .map(([dimension]) => dimension);

    const weakDifferentiationDimensions =
      Object.entries(dimensionScores)
        .filter(
          ([, score]) =>
            score >= 50 && score < 75,
        )
        .sort((first, second) =>
          second[1] - first[1],
        )
        .map(([dimension]) => dimension);

    return {
      firstItem: duplicate.firstItem,
      secondItem: duplicate.secondItem,
      similarity,
      severity,
      matchedDimensions,
      strongestDimensions:
        strongestDimensions.length > 0
          ? strongestDimensions
          : matchedDimensions,
      weakDifferentiationDimensions,
      reason:
        duplicate.reason ??
        `Semantic similarity detected at ${similarity}%.`,
      detectionMethod:
        duplicate.detectionMethod ??
        'semantic-fingerprint-model',
      requiredAction:
        this.mapRequiredAction(severity),
    };
  }

  private firstDuplicateCollection(
    records: Array<Record<string, unknown>>,
  ): DuplicateConceptInput[] {
    for (const record of records) {
      const parsed = this.readDuplicateConcepts(
        record.duplicatedConcepts,
      );

      if (parsed.length > 0) {
        return parsed;
      }
    }

    return [];
  }

  private firstArrayValue(
    records: Array<Record<string, unknown>>,
    key: string,
  ): unknown[] {
    for (const record of records) {
      if (Array.isArray(record[key])) {
        return record[key] as unknown[];
      }
    }

    return [];
  }

  private firstNumberValue(
    records: Array<Record<string, unknown>>,
    key: string,
  ): number | undefined {
    for (const record of records) {
      const value = record[key];

      if (
        typeof value === 'number' &&
        Number.isFinite(value)
      ) {
        return value;
      }
    }

    return undefined;
  }

  private readDuplicateConcepts(
    value: unknown,
  ): DuplicateConceptInput[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => {
        const record = this.asRecord(item);

        return {
          firstItem: this.normalizeNumber(
            record.firstItem,
            0,
          ),
          secondItem: this.normalizeNumber(
            record.secondItem,
            0,
          ),
          similarity: this.normalizeNumber(
            record.similarity,
            0,
          ),
          matchedDimensions: Array.isArray(
            record.matchedDimensions,
          )
            ? record.matchedDimensions.filter(
                (
                  dimension,
                ): dimension is string =>
                  typeof dimension === 'string',
              )
            : [],
          dimensionScores:
            this.readDimensionScores(
              record.dimensionScores,
            ),
          reason:
            typeof record.reason === 'string'
              ? record.reason
              : undefined,
          detectionMethod:
            typeof record.detectionMethod ===
            'string'
              ? record.detectionMethod
              : 'semantic-fingerprint-model',
        };
      })
      .filter(
        (item) =>
          item.firstItem > 0 &&
          item.secondItem > 0,
      );
  }

  private readDimensionScores(
    value: unknown,
  ): DuplicateDimensionScores {
    const record = this.asRecord(value);
    const scores: DuplicateDimensionScores = {};

    for (const [key, rawScore] of Object.entries(
      record,
    )) {
      const score = this.normalizeNumber(
        rawScore,
        0,
      );

      if (score >= 0) {
        scores[key] = score;
      }
    }

    return scores;
  }

  private calculateOriginalityScore(
    analyzedItemCount: number,
    pairs: DuplicatePairAnalysis[],
  ): number {
    if (
      analyzedItemCount <= 1 ||
      pairs.length === 0
    ) {
      return 100;
    }

    const averageSimilarity =
      pairs.reduce(
        (total, pair) =>
          total + pair.similarity,
        0,
      ) / pairs.length;

    const affectedItems = new Set(
      pairs.flatMap((pair) => [
        pair.firstItem,
        pair.secondItem,
      ]),
    ).size;

    const affectedRatio =
      affectedItems / analyzedItemCount;

    return Math.round(
      this.clamp(
        100 -
          averageSimilarity *
            affectedRatio *
            0.75,
        0,
        100,
      ),
    );
  }

  private classifySeverity(
    similarity: number,
  ): DuplicateSeverity {
    if (similarity >= 90) {
      return 'critical';
    }

    if (similarity >= 80) {
      return 'high';
    }

    if (similarity >= 65) {
      return 'medium';
    }

    if (similarity > 0) {
      return 'low';
    }

    return 'none';
  }

  private calculateOverallSeverity(
    pairs: DuplicatePairAnalysis[],
  ): DuplicateSeverity {
    if (pairs.length === 0) {
      return 'none';
    }

    const rank: Record<
      DuplicateSeverity,
      number
    > = {
      none: 0,
      low: 1,
      medium: 2,
      high: 3,
      critical: 4,
    };

    return pairs.reduce<DuplicateSeverity>(
      (highest, pair) =>
        rank[pair.severity] > rank[highest]
          ? pair.severity
          : highest,
      'none',
    );
  }

  private mapRequiredAction(
    severity: DuplicateSeverity,
  ): DuplicatePairAnalysis['requiredAction'] {
    switch (severity) {
      case 'critical':
        return 'complete-reinvention';

      case 'high':
        return 'major-rebuild';

      case 'medium':
        return 'structural-differentiation';

      case 'low':
        return 'minor-differentiation';

      default:
        return 'none';
    }
  }

  private buildSummary(
    pairCount: number,
    severity: DuplicateSeverity,
    affectedItems: number[],
    detectionMethods: string[],
  ): string {
    if (pairCount === 0) {
      return 'No meaningful semantic duplication was detected.';
    }

    return [
      `${pairCount} duplicate semantic pair(s) detected.`,
      `Overall severity: ${severity}.`,
      `Affected items: ${affectedItems.join(', ')}.`,
      `Detection: ${detectionMethods.join(', ')}.`,
    ].join(' ');
  }

  private asRecord(
    value: unknown,
  ): Record<string, unknown> {
    if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    ) {
      return value as Record<string, unknown>;
    }

    return {};
  }

  private normalizeNumber(
    value: unknown,
    fallback: number,
  ): number {
    if (
      typeof value === 'number' &&
      Number.isFinite(value)
    ) {
      return value;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed)
      ? parsed
      : fallback;
  }

  private clamp(
    value: number,
    minimum: number,
    maximum: number,
  ): number {
    return Math.min(
      maximum,
      Math.max(minimum, value),
    );
  }
}