import { Injectable } from '@nestjs/common';
import {
  CharacterProfile,
  CreativeProjectBrief,
  VoicePlan,
} from '../creative-intelligence.types';

@Injectable()
export class VoiceIntelligenceService {
  build(
    brief: CreativeProjectBrief,
    characters: CharacterProfile[],
  ): VoicePlan {
    const languages = brief.languages ?? ['Arabic', 'English'];

    return {
      characters: characters.map((character) => ({
        characterId: character.id,
        castingDirection: character.voice,
        deliveryRules: [
          'preserve-character-identity',
          'preserve-emotional-continuity',
          'avoid-flat-delivery',
          'match-scene-intensity',
          'respect-language-pronunciation',
        ],
        languageVariants: languages,
      })),
      narrator: {
        style: `${brief.tone ?? 'cinematic'} narrator`,
        deliveryRules: [
          'clear',
          'confident',
          'emotionally-controlled',
          'not-overdramatic',
          'language-native-delivery',
        ],
      },
    };
  }
}