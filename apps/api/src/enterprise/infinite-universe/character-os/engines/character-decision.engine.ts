import { Injectable } from '@nestjs/common';

import { GenerateCharacterDecisionDto } from '../dto/generate-character-decision.dto';

import type {
  CharacterDecisionEvaluation,
  CharacterDecisionResult,
  LivingCharacter,
} from '../models/character-os.models';

@Injectable()
export class CharacterDecisionEngine {
  generate(
    character: LivingCharacter,
    dto: GenerateCharacterDecisionDto,
  ): CharacterDecisionResult {
    const evaluations =
      dto.options.map((option) =>
        this.evaluate(
          character,
          option,
        ),
      );

    evaluations.sort(
      (left, right) =>
        right.totalScore -
        left.totalScore,
    );

    const selected =
      evaluations[0];

    if (!selected) {
      throw new Error(
        'No decision option was available.',
      );
    }

    return {
      success: true,
      engine:
        'CreatorOS Character Decision Engine',
      version: '1.0.0',
      status:
        'decision-generated',

      characterId:
        character.identity
          .characterId,

      characterName:
        character.identity
          .canonicalName,

      selectedOptionId:
        selected.optionId,

      selectedOptionTitle:
        selected.title,

      evaluations,

      psychologicalExplanation:
        this.explain(
          character,
          selected,
          dto.situation,
        ),

      continuityWarnings:
        this.continuityWarnings(
          character,
          selected,
        ),
    };
  }

  private evaluate(
    character: LivingCharacter,
    option:
      GenerateCharacterDecisionDto['options'][number],
  ): CharacterDecisionEvaluation {
    const psychology =
      character.psychology;

    const decisionStyle =
      psychology.decisionStyle;

    let personalityFit = 60;

    if (
      decisionStyle ===
        'cautious' ||
      decisionStyle ===
        'analytical'
    ) {
      personalityFit =
        100 - option.risk;
    }

    if (
      decisionStyle ===
      'impulsive'
    ) {
      personalityFit =
        45 +
        option.risk * 0.45;
    }

    if (
      decisionStyle ===
      'collaborative'
    ) {
      personalityFit =
        this.clamp(
          60 +
          option.relationshipImpact *
          0.35,
        );
    }

    if (
      decisionStyle ===
      'emotional'
    ) {
      personalityFit =
        this.clamp(
          70 -
          option.moralCost *
          0.2 +
          option.relationshipImpact *
          0.25,
        );
    }

    const emotionalFit =
      this.clamp(
        psychology.emotionalState
          .confidence *
        0.35 +
        psychology.emotionalState
          .hope *
        0.25 +
        (
          100 -
          psychology.emotionalState
            .fear
        ) *
        0.4 -
        option.fearActivation *
        0.25,
      );

    const goalFit =
      this.clamp(
        option.goalAlignment,
      );

    const valueFit =
      this.clamp(
        100 -
        option.moralCost *
        (
          psychology.empathy /
          100
        ),
      );

    const relationshipFit =
      this.clamp(
        50 +
        option.relationshipImpact *
        0.5,
      );

    const fearPenalty =
      this.clamp(
        option.fearActivation *
        (
          1 -
          psychology.stressTolerance /
          200
        ),
      );

    const totalScore =
      this.clamp(
        personalityFit * 0.22 +
        emotionalFit * 0.18 +
        goalFit * 0.25 +
        valueFit * 0.18 +
        relationshipFit * 0.12 +
        (
          100 -
          fearPenalty
        ) *
        0.05,
      );

    return {
      optionId:
        option.optionId,

      title:
        option.title,

      personalityFit:
        this.round(
          personalityFit,
        ),

      emotionalFit:
        this.round(
          emotionalFit,
        ),

      goalFit:
        this.round(
          goalFit,
        ),

      valueFit:
        this.round(
          valueFit,
        ),

      relationshipFit:
        this.round(
          relationshipFit,
        ),

      fearPenalty:
        this.round(
          fearPenalty,
        ),

      totalScore:
        this.round(
          totalScore,
        ),

      reasons:
        this.reasons(
          character,
          option,
        ),
    };
  }

  private reasons(
    character: LivingCharacter,
    option:
      GenerateCharacterDecisionDto['options'][number],
  ): string[] {
    const output = [
      `أسلوب القرار: ${character.psychology.decisionStyle}.`,
      `توافق الخيار مع الهدف: ${option.goalAlignment}%.`,
      `تكلفته الأخلاقية: ${option.moralCost}%.`,
      `مستوى المخاطرة: ${option.risk}%.`,
    ];

    if (
      option.fearActivation >=
      60
    ) {
      output.push(
        'الخيار ينشط خوفًا قويًا لدى الشخصية.',
      );
    }

    if (
      option.relationshipImpact >
      30
    ) {
      output.push(
        'الخيار يدعم العلاقات الحالية.',
      );
    }

    if (
      option.relationshipImpact <
      -30
    ) {
      output.push(
        'الخيار قد يضر بعلاقة مهمة.',
      );
    }

    return output;
  }

  private explain(
    character: LivingCharacter,
    selected:
      CharacterDecisionEvaluation,
    situation: string,
  ): string[] {
    return [
      `في الموقف: ${situation}`,
      `اختارت الشخصية "${selected.title}" لأنه الأعلى توافقًا مع تكوينها النفسي.`,
      `العاطفة المسيطرة حاليًا: ${character.psychology.emotionalState.dominantEmotion}.`,
      `الهدف الأعلى أولوية: ${character.goals.find((goal) => goal.active)?.title ?? 'غير محدد'}.`,
      `الخوف الأقوى: ${character.fears.filter((fear) => !fear.resolved).sort((a, b) => b.intensity - a.intensity)[0]?.name ?? 'غير محدد'}.`,
      `درجة القرار النهائية: ${selected.totalScore}%.`,
    ];
  }

  private continuityWarnings(
    character: LivingCharacter,
    selected:
      CharacterDecisionEvaluation,
  ): string[] {
    const output: string[] = [];

    if (
      selected.personalityFit <
      45
    ) {
      output.push(
        'القرار ضعيف التوافق مع شخصية الكيان وقد يحتاج حدثًا سابقًا يبرره.',
      );
    }

    if (
      selected.valueFit <
      40
    ) {
      output.push(
        'القرار يتعارض مع القيم الحالية للشخصية.',
      );
    }

    if (
      selected.fearPenalty >
      65
    ) {
      output.push(
        'الخيار يتجاوز خوفًا جوهريًا ويحتاج تطورًا نفسيًا أو دعمًا من شخصية أخرى.',
      );
    }

    if (
      character.memories.length ===
      0
    ) {
      output.push(
        'ذاكرة الشخصية ما زالت محدودة؛ القرار يعتمد أساسًا على Character DNA.',
      );
    }

    return output;
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
    return (
      Math.round(
        value * 100,
      ) / 100
    );
  }
}
