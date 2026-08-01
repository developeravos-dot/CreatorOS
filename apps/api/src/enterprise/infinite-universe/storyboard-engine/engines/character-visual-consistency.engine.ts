import { Injectable } from '@nestjs/common';

import type {
  LivingCharacter,
} from '../../character-os/models/character-os.models';

import type {
  CharacterVisualState,
} from '../models/storyboard.models';

@Injectable()
export class CharacterVisualConsistencyEngine {
  createState(
    character: LivingCharacter,
    index: number,
    sceneType: string,
    visibleEmotion: string,
    hiddenEmotion: string,
  ): CharacterVisualState {
    return {
      characterId:
        character.identity.characterId,

      characterName:
        character.identity.canonicalName,

      position:
        index === 0
          ? 'center'
          : index === 1
            ? 'left'
            : 'right',

      pose:
        this.pose(
          character,
          sceneType,
        ),

      facialExpression:
        this.expression(
          visibleEmotion,
          sceneType,
        ),

      eyeDirection:
        index === 0
          ? 'نحو العنصر المحوري'
          : 'نحو الشخصية الرئيسية',

      bodyOrientation:
        sceneType === 'conflict'
          ? 'زاوية ثلاثية الأرباع مع توتر خفيف'
          : 'مواجهة مفتوحة تسمح بالتفاعل',

      wardrobeContinuity: [
        character.identity
          .visualDescription,

        'الحفاظ على الملابس نفسها داخل الحلقة.',

        'عدم تغيير الألوان أو الأدوات المميزة بين اللقطات.',
      ],

      signatureElements: [
        ...character.identity
          .signatureElements,
      ],

      visibleEmotion,
      hiddenEmotion,
    };
  }

  private pose(
    character: LivingCharacter,
    sceneType: string,
  ): string {
    const style =
      character.psychology.decisionStyle;

    if (sceneType === 'decision') {
      return 'وقفة ثابتة مع يد قريبة من الصدر وتردد قبل الحركة';
    }

    if (sceneType === 'conflict') {
      return style === 'impulsive'
        ? 'تقدم نصف خطوة مع حركة يد سريعة'
        : 'وقفة حذرة مع كتفين مشدودين';
    }

    if (sceneType === 'discovery') {
      return 'ميل خفيف إلى الأمام مع تركيز بصري على الدليل';
    }

    if (sceneType === 'reversal') {
      return 'توقف مفاجئ ثم التفات سريع نحو مصدر المعلومة';
    }

    return 'وقفة طبيعية متوازنة مناسبة للحوار';
  }

  private expression(
    emotion: string,
    sceneType: string,
  ): string {
    if (sceneType === 'reversal') {
      return 'دهشة واضحة مع اتساع العينين دون مبالغة مخيفة';
    }

    if (sceneType === 'conflict') {
      return 'جدية معتدلة مع توتر حول الحاجبين';
    }

    if (sceneType === 'decision') {
      return 'تفكير عميق مع تردد ثم ثبات';
    }

    if (emotion.includes('فضول')) {
      return 'فضول دافئ وانتباه واضح';
    }

    return 'تعبير متوافق مع الحالة النفسية للمشهد';
  }
}
