import { Injectable } from '@nestjs/common';

import type {
  CharacterVisualState,
} from '../models/storyboard.models';

@Injectable()
export class VisualProductionPromptEngine {
  imagePrompt(
    visualStyle: string,
    environment: string,
    shotType: string,
    cameraAngle: string,
    lightingMood: string,
    characters: CharacterVisualState[],
    narrativePurpose: string,
  ): string {
    const characterText =
      characters
        .map(
          (character) =>
            `${character.characterName}: ${character.pose}, ${character.facialExpression}, ${character.position}, عناصر ثابتة: ${character.signatureElements.join('، ')}`,
        )
        .join('. ');

    return [
      visualStyle,
      `مشهد رسوم متحركة سينمائي في ${environment}`,
      `نوع اللقطة ${shotType}`,
      `زاوية الكاميرا ${cameraAngle}`,
      `الإضاءة ${lightingMood}`,
      `الشخصيات: ${characterText}`,
      `الهدف السردي: ${narrativePurpose}`,
      'جودة عالية',
      'تصميم شخصيات أصلي',
      'اتساق كامل في الوجه والملابس والألوان والنسب',
      'مناسب للأطفال',
      'تكوين بصري واضح',
      'بدون كتابة داخل الصورة',
    ].join('. ');
  }

  videoPrompt(
    environment: string,
    cameraMovement: string,
    durationSeconds: number,
    characters: CharacterVisualState[],
    psychologicalPurpose: string,
  ): string {
    const movements =
      characters
        .map(
          (character) =>
            `${character.characterName} يقوم بـ ${character.pose} مع تعبير ${character.facialExpression}`,
        )
        .join('، ');

    return [
      `فيديو رسوم متحركة سينمائي داخل ${environment}`,
      `مدة تقريبية ${durationSeconds} ثانية`,
      `حركة الكاميرا: ${cameraMovement}`,
      movements,
      `الهدف النفسي: ${psychologicalPurpose}`,
      'حركة طبيعية ناعمة',
      'عدم تغيير شكل الشخصيات أثناء اللقطة',
      'عدم تبديل الملابس أو الألوان',
      'عدم تشويه الوجه أو اليدين',
      'الحفاظ على اتجاه النظر والمسافات بين الشخصيات',
    ].join('. ');
  }

  negativePrompt(): string {
    return [
      'تشوه الوجه',
      'تغير هوية الشخصية',
      'اختلاف الملابس',
      'أطراف إضافية',
      'أصابع مشوهة',
      'تغير العمر',
      'تغير لون الشعر',
      'تغير لون العين',
      'عدم تناسق الحجم',
      'ازدواج الشخصية',
      'خلفية مشوهة',
      'كتابة غير مطلوبة',
      'شعار',
      'علامة مائية',
      'عنف دموي',
      'رعب قاس',
      'إضاءة مرعبة',
      'حركة كاميرا عشوائية',
      'اهتزاز مفرط',
      'تغير الأسلوب البصري',
    ].join(', ');
  }
}
