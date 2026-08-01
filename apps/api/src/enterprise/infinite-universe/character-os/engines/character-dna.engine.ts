import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { CreateCharacterRosterDto } from '../dto/create-character-roster.dto';

import type {
  CharacterFear,
  CharacterGoal,
  CharacterLocalization,
  LivingCharacter,
  PsychologicalProfile,
} from '../models/character-os.models';

type CharacterBlueprint =
  CreateCharacterRosterDto['characters'][number];

@Injectable()
export class CharacterDnaEngine {
  create(
    dto: CreateCharacterRosterDto,
    blueprint: CharacterBlueprint,
  ): LivingCharacter {
    const now = new Date().toISOString();

    return {
      identity: {
        characterId: randomUUID(),
        worldId: dto.worldId,

        canonicalName:
          blueprint.canonicalName,

        role: blueprint.role,
        audienceTier: dto.audienceTier,

        age: blueprint.age,
        apparentAge: blueprint.age,

        species:
          blueprint.species ??
          'human',

        genderIdentity:
          blueprint.genderIdentity ??
          'unspecified',

        biography:
          blueprint.biography,

        visualDescription:
          blueprint.visualDescription,

        originLocation:
          blueprint.originLocation,

        currentLocation:
          blueprint.currentLocation ??
          blueprint.originLocation,

        signatureElements:
          this.unique(
            blueprint.signatureElements ??
            [],
          ),
      },

      psychology:
        this.createPsychology(
          dto.audienceTier,
          blueprint,
          now,
        ),

      goals:
        this.createGoals(
          blueprint.goals,
        ),

      fears:
        this.createFears(
          blueprint.fears,
        ),

      secrets:
        this.unique(
          blueprint.secrets ?? [],
        ),

      values:
        this.unique(
          blueprint.values,
        ),

      skills:
        this.unique(
          blueprint.skills,
        ),

      weaknesses:
        this.unique(
          blueprint.weaknesses,
        ),

      memories: [],
      relationships: [],

      localizations:
        this.createLocalizations(
          blueprint.canonicalName,
          dto.languages,
          blueprint,
        ),

      continuity: {
        version: 1,
        totalExperiences: 0,
        majorPsychologicalChanges: 0,
        unresolvedInternalConflicts:
          this.initialConflicts(
            blueprint,
          ),

        continuityScore: 100,
        lastUpdatedAt: now,
      },
    };
  }

  private createPsychology(
    audienceTier:
      CreateCharacterRosterDto['audienceTier'],
    blueprint: CharacterBlueprint,
    now: string,
  ): PsychologicalProfile {
    const tierIntensity =
      audienceTier === 'kids'
        ? 45
        : audienceTier === 'junior'
          ? 58
          : audienceTier === 'teen'
            ? 74
            : 82;

    return {
      personalityArchetype:
        blueprint.personalityArchetype,

      traits: [
        this.trait(
          'curiosity',
          tierIntensity + 15,
        ),

        this.trait(
          'courage',
          55,
        ),

        this.trait(
          'empathy',
          audienceTier === 'kids'
            ? 75
            : 65,
        ),

        this.trait(
          'discipline',
          50,
        ),

        this.trait(
          'trust',
          65,
        ),

        this.trait(
          'impulsivity',
          blueprint.decisionStyle ===
            'impulsive'
            ? 80
            : 40,
        ),

        this.trait(
          'resilience',
          60,
        ),
      ],

      needs: [
        {
          name: 'belonging',
          urgency: 65,
          satisfaction: 55,
        },

        {
          name: 'safety',
          urgency:
            audienceTier === 'kids'
              ? 80
              : 55,
          satisfaction: 60,
        },

        {
          name: 'competence',
          urgency: 70,
          satisfaction: 45,
        },

        {
          name: 'meaning',
          urgency:
            audienceTier === 'adult'
              ? 85
              : 45,
          satisfaction: 40,
        },
      ],

      attachmentStyle:
        blueprint.attachmentStyle ??
        'secure',

      decisionStyle:
        blueprint.decisionStyle ??
        'adaptive',

      moralOrientation:
        blueprint.values[0] ??
        'balance',

      stressTolerance:
        audienceTier === 'kids'
          ? 45
          : 65,

      empathy:
        audienceTier === 'kids'
          ? 78
          : 68,

      selfAwareness:
        audienceTier === 'kids'
          ? 35
          : audienceTier === 'teen'
            ? 55
            : 70,

      adaptability: 70,

      emotionalState: {
        happiness: 65,
        sadness: 10,
        fear: 15,
        anger: 5,
        curiosity: 80,
        confidence: 55,
        guilt: 0,
        hope: 75,
        loneliness: 15,

        dominantEmotion:
          'curiosity',

        emotionalStability: 75,
        lastUpdatedAt: now,
      },
    };
  }

  private createGoals(
    values: string[],
  ): CharacterGoal[] {
    return values.map(
      (value, index) => ({
        id: randomUUID(),
        title: value,
        description:
          `يسعى لتحقيق الهدف: ${value}.`,

        priority:
          Math.max(
            40,
            90 - index * 10,
          ),

        progress: 0,
        active: true,
        hidden: false,
        longTerm: index === 0,
      }),
    );
  }

  private createFears(
    values: string[],
  ): CharacterFear[] {
    return values.map(
      (value, index) => ({
        id: randomUUID(),
        name: value,

        intensity:
          Math.max(
            35,
            75 - index * 8,
          ),

        origin:
          'لم يُكشف بعد',

        copingStrategy:
          'يُكتشف تدريجيًا عبر التجارب',

        resolved: false,
      }),
    );
  }

  private createLocalizations(
    canonicalName: string,
    languages:
      CreateCharacterRosterDto['languages'],
    blueprint: CharacterBlueprint,
  ): CharacterLocalization[] {
    return languages.map(
      (language) => ({
        languageCode:
          language.code.toLowerCase(),

        localizedName:
          canonicalName,

        voiceProfile:
          this.voiceProfile(
            blueprint,
            language.code,
          ),

        speechStyle:
          this.speechStyle(
            blueprint,
          ),

        culturalNotes: [
          `تكييف الشخصية مع ${language.name} دون تغيير هويتها الأساسية.`,
          'الحفاظ على الذاكرة والدوافع والعلاقات في جميع اللغات.',
        ],

        adaptationMode:
          language.adaptationMode,
      }),
    );
  }

  private voiceProfile(
    blueprint: CharacterBlueprint,
    languageCode: string,
  ): string {
    return [
      blueprint.role,
      blueprint.personalityArchetype,
      `age-${blueprint.age}`,
      languageCode.toLowerCase(),
    ].join(':');
  }

  private speechStyle(
    blueprint: CharacterBlueprint,
  ): string {
    if (
      blueprint.decisionStyle ===
      'analytical'
    ) {
      return 'هادئ ودقيق ويطرح أسئلة قبل الحكم';
    }

    if (
      blueprint.decisionStyle ===
      'impulsive'
    ) {
      return 'سريع وعفوي ومباشر';
    }

    if (
      blueprint.decisionStyle ===
      'emotional'
    ) {
      return 'تعبيري وحساس ويستخدم لغة المشاعر';
    }

    if (
      blueprint.decisionStyle ===
      'collaborative'
    ) {
      return 'ودود ويشرك الآخرين في الحوار';
    }

    return 'مرن ومتوازن ويتغير حسب الموقف';
  }

  private initialConflicts(
    blueprint: CharacterBlueprint,
  ): string[] {
    return [
      `${blueprint.goals[0] ?? 'الهدف'} مقابل ${blueprint.fears[0] ?? 'الخوف'}`,
      `${blueprint.values[0] ?? 'القيمة'} مقابل ${blueprint.weaknesses[0] ?? 'نقطة الضعف'}`,
    ];
  }

  private trait(
    name: string,
    value: number,
  ) {
    return {
      name,
      value:
        this.clamp(value),
      stability: 80,
      visible: true,
    };
  }

  private unique(
    values: string[],
  ): string[] {
    return [
      ...new Set(
        values
          .map(
            (value) =>
              value.trim(),
          )
          .filter(Boolean),
      ),
    ];
  }

  private clamp(
    value: number,
  ): number {
    return Math.max(
      0,
      Math.min(100, value),
    );
  }
}
