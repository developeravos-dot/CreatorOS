import { Injectable } from '@nestjs/common';
import {
  DistributionBrief,
  LocalizationPlan,
} from '../audience-distribution.types';

@Injectable()
export class GlobalLocalizationService {
  build(brief: DistributionBrief): LocalizationPlan {
    const sourceLanguage = brief.sourceLanguage ?? 'Arabic';
    const targets = brief.targetLanguages ?? ['Arabic', 'English'];

    return {
      sourceLanguage,
      targets: targets.map((language) => ({
        language,
        translationMode:
          language === sourceLanguage
            ? 'source-master'
            : 'meaning-first-cultural-localization',
        dubbingMode:
          language === sourceLanguage
            ? 'original-voice'
            : 'native-voice-adaptation',
        subtitleMode: 'native-readable-subtitles',
        status: 'planned',
      })),
      preservationRules: [
        'preserve-core-meaning',
        'preserve-brand-voice',
        'preserve-character-intent',
        'avoid-literal-translation-when-unnatural',
        'validate-names-and-pronunciation',
        'human-review-before-release',
      ],
    };
  }
}