import { Injectable } from '@nestjs/common';

import type {
  CanonicalIdentityFingerprint,
  ConsistencyDeviation,
  VisualConsistencyValidation,
  VisualGenerationSnapshot,
} from '../models/visual-consistency.models';

@Injectable()
export class VisualIdentityValidatorEngine {
  validate(
    fingerprint:
      CanonicalIdentityFingerprint,

    snapshot:
      VisualGenerationSnapshot,
  ): Omit<
    VisualConsistencyValidation,
    | 'validationId'
    | 'createdAt'
  > {
    const expected =
      fingerprint.canonicalValues;

    const actual =
      snapshot.extractedValues;

    const identityScore =
      this.textScore(
        expected.identityDescription,
        actual.identityDescription ??
          snapshot.prompt,
      );

    const colorScore =
      this.arrayScore(
        expected.primaryColors,
        actual.colors ?? [],
        snapshot.prompt,
      );

    const proportionScore =
      this.arrayScore(
        expected.proportions,
        actual.proportions ?? [],
        snapshot.prompt,
      );

    const signatureElementScore =
      this.arrayScore(
        expected.signatureElements,
        actual.signatureElements ??
          [],
        snapshot.prompt,
      );

    const continuityKeyScore =
      this.keyScore(
        expected.continuityKeys,
        snapshot.continuityKeys,
      );

    const totalScore =
      this.round(
        identityScore * 0.35 +
        colorScore * 0.2 +
        proportionScore * 0.17 +
        signatureElementScore *
          0.18 +
        continuityKeyScore * 0.1,
      );

    const deviations:
      ConsistencyDeviation[] = [];

    if (identityScore < 85) {
      deviations.push({
        field: 'identity',

        severity:
          identityScore < 60
            ? 'critical'
            : identityScore < 75
              ? 'high'
              : 'medium',

        expected: [
          expected.identityDescription,
        ],

        actual: [
          actual.identityDescription ??
            snapshot.prompt,
        ],

        score:
          identityScore,

        explanation:
          'وصف الهوية الناتج لا يغطي العناصر الأساسية للهوية المرجعية بدرجة كافية.',

        recommendedRepair:
          'إضافة Canonical Identity Description وIdentity Lock Prompt كاملين إلى الطلب.',
      });
    }

    if (colorScore < 85) {
      deviations.push({
        field: 'colors',

        severity:
          colorScore < 60
            ? 'high'
            : 'medium',

        expected:
          expected.primaryColors,

        actual:
          actual.colors ?? [],

        score:
          colorScore,

        explanation:
          'الألوان المرجعية غير ظاهرة أو غير مثبتة بصورة كافية.',

        recommendedRepair:
          'إضافة جميع الألوان المقفلة بأسمائها وقيم HEX.',
      });
    }

    if (proportionScore < 80) {
      deviations.push({
        field: 'proportions',

        severity:
          proportionScore < 55
            ? 'high'
            : 'medium',

        expected:
          expected.proportions,

        actual:
          actual.proportions ?? [],

        score:
          proportionScore,

        explanation:
          'معلومات العمر والطول ونسب الجسم أو المقياس غير مكتملة.',

        recommendedRepair:
          'إضافة Scale Bible ونسب الجسم أو البيئة إلى الطلب.',
      });
    }

    if (
      signatureElementScore < 85
    ) {
      deviations.push({
        field:
          'signature-elements',

        severity:
          signatureElementScore < 60
            ? 'high'
            : 'medium',

        expected:
          expected.signatureElements,

        actual:
          actual.signatureElements ??
          [],

        score:
          signatureElementScore,

        explanation:
          'بعض العناصر المميزة غير مثبتة في وصف التوليد.',

        recommendedRepair:
          'إضافة جميع Signature Elements إلى الطلب ومنع حذفها أو استبدالها.',
      });
    }

    if (
      continuityKeyScore < 100
    ) {
      deviations.push({
        field:
          'continuity-keys',

        severity:
          continuityKeyScore < 60
            ? 'high'
            : 'low',

        expected:
          expected.continuityKeys,

        actual:
          snapshot.continuityKeys,

        score:
          continuityKeyScore,

        explanation:
          'الطلب لا يحمل جميع مفاتيح الاستمرارية المرجعية.',

        recommendedRepair:
          'دمج مفاتيح الاستمرارية الناقصة قبل إرسال الطلب للمزود.',
      });
    }

    const status =
      totalScore >= 90 &&
      identityScore >= 85
        ? 'passed'
        : totalScore >= 75 &&
            identityScore >= 65
          ? 'warning'
          : 'failed';

    return {
      worldId:
        snapshot.worldId,

      bibleId:
        snapshot.bibleId,

      entityType:
        fingerprint.entityType,

      entityId:
        fingerprint.entityId,

      entityName:
        fingerprint.entityName,

      fingerprintId:
        fingerprint.fingerprintId,

      snapshotId:
        snapshot.snapshotId,

      status,

      scores: {
        identityScore,
        colorScore,
        proportionScore,
        signatureElementScore,
        continuityKeyScore,
        totalScore,
      },

      deviations,

      repairRequired:
        status !== 'passed',

      humanApprovalRequired:
        status !== 'passed',
    };
  }

  private textScore(
    expected: string,
    actual: string,
  ): number {
    const expectedTokens =
      this.tokens(expected);

    const actualTokens =
      this.tokens(actual);

    if (
      expectedTokens.size === 0
    ) {
      return 100;
    }

    const matched =
      [
        ...expectedTokens,
      ].filter(
        (token) =>
          actualTokens.has(token),
      ).length;

    return this.round(
      matched /
      expectedTokens.size *
      100,
    );
  }

  private arrayScore(
    expected: string[],
    actual: string[],
    prompt: string,
  ): number {
    if (
      expected.length === 0
    ) {
      return 100;
    }

    const combined =
      this.normalize(
        [
          ...actual,
          prompt,
        ].join(' '),
      );

    const matched =
      expected.filter(
        (item) => {
          const normalizedItem =
            this.normalize(item);

          const parts =
            normalizedItem
              .split(' ')
              .filter(
                (part) =>
                  part.length >= 3,
              );

          return (
            combined.includes(
              normalizedItem,
            ) ||
            parts.some(
              (part) =>
                combined.includes(part),
            )
          );
        },
      ).length;

    return this.round(
      matched /
      expected.length *
      100,
    );
  }

  private keyScore(
    expected: string[],
    actual: string[],
  ): number {
    if (
      expected.length === 0
    ) {
      return 100;
    }

    const actualSet =
      new Set(actual);

    const matched =
      expected.filter(
        (key) =>
          actualSet.has(key),
      ).length;

    return this.round(
      matched /
      expected.length *
      100,
    );
  }

  private tokens(
    value: string,
  ): Set<string> {
    return new Set(
      this.normalize(value)
        .split(' ')
        .filter(
          (token) =>
            token.length >= 3,
        ),
    );
  }

  private normalize(
    value: string,
  ): string {
    return value
      .trim()
      .toLowerCase()
      .replace(
        /[^\p{L}\p{N}#]+/gu,
        ' ',
      )
      .replace(/\s+/g, ' ');
  }

  private round(
    value: number,
  ): number {
    return (
      Math.round(
        value * 100,
      ) / 100
    );
  }
}
