import { Injectable } from '@nestjs/common';

import type {
  VisualReferenceBible,
} from '../models/visual-reference-bible.models';

@Injectable()
export class VisualReferenceBibleQualityEngine {
  evaluate(
    expectedCharacters: number,
    expectedEnvironments: number,
    expectedProps: number,

    bible: Pick<
      VisualReferenceBible,
      | 'characterReferences'
      | 'environmentReferences'
      | 'propReferences'
      | 'colorBible'
      | 'scaleBible'
    >,
  ): VisualReferenceBible['quality'] {
    const warnings: string[] = [];

    const characterCoverage =
      this.coverage(
        bible.characterReferences
          .length,

        expectedCharacters,
      );

    const environmentCoverage =
      this.coverage(
        bible.environmentReferences
          .length,

        expectedEnvironments,
      );

    const propCoverage =
      expectedProps === 0
        ? 100
        : this.coverage(
            bible.propReferences.length,
            expectedProps,
          );

    const colorConsistency =
      bible.characterReferences
        .every(
          (reference) =>
            reference.colorPalette
              .length >= 2 &&
            reference.colorPalette
              .every(
                (color) =>
                  color.locked,
              ),
        )
        ? 100
        : 70;

    const scaleConsistency =
      bible.scaleBible
        .characterScales.length ===
      expectedCharacters
        ? 100
        : 65;

    const promptReadiness =
      [
        ...bible.characterReferences
          .map(
            (reference) =>
              Boolean(
                reference.canonicalPrompt,
              ),
          ),

        ...bible.environmentReferences
          .map(
            (reference) =>
              Boolean(
                reference.canonicalPrompt,
              ),
          ),

        ...bible.propReferences
          .map(
            (reference) =>
              Boolean(
                reference.canonicalPrompt,
              ),
          ),
      ].every(Boolean)
        ? 100
        : 70;

    if (
      characterCoverage < 100
    ) {
      warnings.push(
        'بعض الشخصيات لا تمتلك Character Reference Sheet.',
      );
    }

    if (
      environmentCoverage < 100
    ) {
      warnings.push(
        'بعض البيئات لا تمتلك Environment Reference Sheet.',
      );
    }

    if (
      propCoverage < 100
    ) {
      warnings.push(
        'بعض الأدوات المميزة لا تمتلك Prop Reference Sheet.',
      );
    }

    if (
      warnings.length === 0
    ) {
      warnings.push(
        'جميع المراجع البصرية الأساسية مكتملة ومتسقة.',
      );
    }

    const totalScore =
      characterCoverage * 0.28 +
      environmentCoverage * 0.2 +
      propCoverage * 0.12 +
      colorConsistency * 0.15 +
      scaleConsistency * 0.12 +
      promptReadiness * 0.13;

    return {
      characterCoverage,
      environmentCoverage,
      propCoverage,
      colorConsistency,
      scaleConsistency,
      promptReadiness,

      totalScore:
        Math.round(
          totalScore * 100,
        ) / 100,

      warnings,
    };
  }

  private coverage(
    actual: number,
    expected: number,
  ): number {
    if (expected <= 0) {
      return 100;
    }

    return Math.min(
      100,
      Math.round(
        actual /
        expected *
        100,
      ),
    );
  }
}
