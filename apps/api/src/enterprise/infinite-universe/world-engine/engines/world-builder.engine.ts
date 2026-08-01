import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import type {
  Civilization,
  UniverseDna,
  WorldEconomy,
  WorldLocation,
  WorldPolitics,
} from '../models/world-engine.models';

@Injectable()
export class WorldBuilderEngine {
  createLocations(
    dna: UniverseDna,
  ): WorldLocation[] {
    return [
      {
        id: randomUUID(),
        name: 'مدينة البدايات',
        type: 'city',
        description:
          'المركز الذي تتقاطع فيه الشخصيات والفرص والأسرار الأولى.',
        population:
          dna.audienceTier === 'kids'
            ? 12000
            : 250000,
        dangerLevel:
          dna.audienceTier === 'kids'
            ? 15
            : 45,
        opportunityLevel: 90,
        emotionalTone:
          'فضول وأمل مع أسرار غير مكتملة',
      },

      {
        id: randomUUID(),
        name: 'المنطقة المتغيرة',
        type: 'region',
        description:
          'منطقة تتبدل اجتماعيًا واقتصاديًا مع تطور العالم.',
        population: 75000,
        dangerLevel: 55,
        opportunityLevel: 75,
        emotionalTone:
          'توتر وتحول واكتشاف',
      },

      {
        id: randomUUID(),
        name: 'الأرشيف المخفي',
        type: 'hidden-place',
        description:
          'مكان يحتفظ بأحداث وأسرار يمكن كشفها تدريجيًا عبر مئات الحلقات.',
        population: 12,
        dangerLevel: 70,
        opportunityLevel: 95,
        emotionalTone:
          'غموض وذاكرة وخوف من الحقيقة',
      },
    ];
  }

  createCivilizations(
    dna: UniverseDna,
  ): Civilization[] {
    return [
      {
        id: randomUUID(),
        name: 'مجتمع البنائين',
        values: [
          'التعاون',
          'الابتكار',
          'المسؤولية',
        ],
        customs: [
          'مجالس الحلول',
          'مشاركة المعرفة',
        ],
        technologyLevel:
          dna.technologyLevel,
        economicPower: 75,
        politicalPower: 55,
        relationships: [
          'تنافس مع مجتمع الحراس',
        ],
      },

      {
        id: randomUUID(),
        name: 'مجتمع الحراس',
        values: [
          'الاستقرار',
          'الوفاء',
          'حماية التاريخ',
        ],
        customs: [
          'حفظ السجلات',
          'اختبارات الثقة',
        ],
        technologyLevel:
          Math.max(
            0,
            dna.technologyLevel - 15,
          ),
        economicPower: 55,
        politicalPower: 80,
        relationships: [
          'تحالف متوتر مع مجتمع البنائين',
        ],
      },
    ];
  }

  createEconomy(): WorldEconomy {
    return {
      currency: 'وحدات الأثر',
      resources: [
        'المعرفة',
        'الطاقة',
        'الوقت',
        'الثقة',
      ],
      scarceResources: [
        'الذاكرة الأصلية',
        'المعلومات الموثوقة',
      ],
      industries: [
        'الاختراع',
        'التعليم',
        'النقل',
        'الترفيه',
      ],
      inequalityLevel: 42,
      volatility: 36,
    };
  }

  createPolitics(): WorldPolitics {
    return {
      governanceModels: [
        'مجالس المدن',
        'مؤسسات مستقلة',
      ],
      institutions: [
        'مجلس الاستمرارية',
        'هيئة الذاكرة',
        'رابطة المخترعين',
      ],
      factions: [
        'البناؤون',
        'الحراس',
        'الباحثون عن الحقيقة',
      ],
      conflictLevel: 48,
      stability: 64,
    };
  }
}
