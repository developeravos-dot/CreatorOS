import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { CreateWorldDto } from '../dto/create-world.dto';
import type {
  UniverseDna,
  UniverseLaw,
} from '../models/world-engine.models';

@Injectable()
export class UniverseDnaEngine {
  create(dto: CreateWorldDto): UniverseDna {
    return {
      id: randomUUID(),
      name: dto.name,
      audienceTier: dto.audienceTier,
      genres: [...new Set(dto.genres)],

      premise: dto.premise,
      visualStyle: dto.visualStyle,
      narrativeTone: dto.narrativeTone,

      technologyLevel: dto.technologyLevel,
      fantasyLevel: dto.fantasyLevel,
      realismLevel: dto.realismLevel,

      endlessStoryEnabled: true,
      agingEnabled: dto.agingEnabled ?? true,
      deathPermanent: dto.deathPermanent ?? true,
      timeTravelEnabled: dto.timeTravelEnabled ?? false,

      artificialIntelligenceEnabled:
        dto.artificialIntelligenceEnabled ?? true,

      laws: this.createLaws(dto),

      languages: dto.languages.map(
        (language) => ({
          code: language.code.toLowerCase(),
          name: language.name,
          primary: language.primary,
          localizationMode:
            language.localizationMode,
        }),
      ),
    };
  }

  private createLaws(
    dto: CreateWorldDto,
  ): UniverseLaw[] {
    const laws: UniverseLaw[] = [
      {
        id: randomUUID(),
        name: 'Psychological Continuity',
        description:
          'كل تجربة مؤثرة تترك أثرًا نفسيًا مستمرًا في الشخصيات ولا تختفي دون معالجة منطقية.',
        immutable: true,
        storyImpact: 100,
      },

      {
        id: randomUUID(),
        name: 'World Before Episode',
        description:
          'الحلقات تنتج من أحداث العالم الحي ولا يُعاد تشكيل العالم لخدمة حلقة منفردة.',
        immutable: true,
        storyImpact: 100,
      },

      {
        id: randomUUID(),
        name: 'No Forced Ending',
        description:
          'لا توجد نهاية إجبارية للعالم، وتبقى خيوط قابلة للنمو باستمرار.',
        immutable: true,
        storyImpact: 100,
      },

      {
        id: randomUUID(),
        name: 'Consequences Persist',
        description:
          'القرارات المهمة تولد نتائج قصيرة وطويلة المدى.',
        immutable: true,
        storyImpact: 95,
      },

      {
        id: randomUUID(),
        name: 'Audience Safety',
        description:
          `يتم ضبط المحتوى نفسيًا وسرديًا بما يناسب فئة ${dto.audienceTier}.`,
        immutable: true,
        storyImpact: 100,
      },
    ];

    if (dto.timeTravelEnabled) {
      laws.push({
        id: randomUUID(),
        name: 'Timeline Cost',
        description:
          'أي تغيير زمني يولد تكلفة أو نتيجة ولا يمحو الماضي بلا أثر.',
        immutable: true,
        storyImpact: 90,
      });
    }

    return laws;
  }
}
