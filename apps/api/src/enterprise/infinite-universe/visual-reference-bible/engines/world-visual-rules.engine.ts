import { Injectable } from '@nestjs/common';

import type {
  LivingCharacter,
} from '../../character-os/models/character-os.models';

import type {
  LivingWorld,
} from '../../world-engine/models/world-engine.models';

import type {
  CharacterReferenceSheet,
  EnvironmentReferenceSheet,
  PropReferenceSheet,
  WorldColorBible,
  WorldScaleBible,
} from '../models/visual-reference-bible.models';

@Injectable()
export class WorldVisualRulesEngine {
  colorBible(
    environments: EnvironmentReferenceSheet[],
  ): WorldColorBible {
    return {
      primaryColors: [
        {
          name: 'دفء العالم',
          hex: '#D9B88F',
          usage: 'المناطق الآمنة والمألوفة',
          locked: true,
        },

        {
          name: 'أزرق المعرفة',
          hex: '#304B6A',
          usage: 'الأرشيف والأسرار',
          locked: true,
        },

        {
          name: 'أخضر النمو',
          hex: '#7AA66B',
          usage: 'التعلم والحياة والتعاون',
          locked: true,
        },
      ],

      secondaryColors: [
        {
          name: 'ذهبي الاكتشاف',
          hex: '#D8B45B',
          usage: 'الأدلة واللحظات المهمة',
          locked: true,
        },

        {
          name: 'فيروزي الذاكرة',
          hex: '#58A6A6',
          usage: 'الإشارات والآليات',
          locked: true,
        },
      ],

      accentColors: [
        {
          name: 'برتقالي الحركة',
          hex: '#E88C3A',
          usage: 'الطاقة والاختراع',
          locked: true,
        },
      ],

      prohibitedColors: [
        {
          name: 'أحمر دموي',
          hex: '#8B0000',
          usage: 'محظور في سياق الأطفال والعنف',
          locked: true,
        },

        {
          name: 'أسود رعب',
          hex: '#050505',
          usage: 'محظور كإضاءة مسيطرة',
          locked: true,
        },
      ],

      emotionalRules: [
        {
          emotion: 'الأمان',
          colorUsage:
            'ألوان دافئة وخضراء مع إضاءة ناعمة.',
        },

        {
          emotion: 'الفضول',
          colorUsage:
            'فيروزي وذهبي كنقاط ضوء.',
        },

        {
          emotion: 'التوتر',
          colorUsage:
            'تقليل التشبع دون التحول إلى ظلام مخيف.',
        },

        {
          emotion: 'المفاجأة',
          colorUsage:
            'ارتفاع مؤقت في التباين والوهج.',
        },
      ],

      locationRules:
        environments.map(
          (environment) => ({
            locationName:
              environment.locationName,

            paletteDescription:
              environment.colorPalette
                .map(
                  (color) =>
                    `${color.name} ${color.hex}`,
                )
                .join('، '),
          }),
        ),
    };
  }

  scaleBible(
    world: LivingWorld,
    characters: LivingCharacter[],
    characterReferences:
      CharacterReferenceSheet[],
    props: PropReferenceSheet[],
  ): WorldScaleBible {
    const referenceHeightUnits = 100;

    return {
      referenceHeightUnits,

      characterScales:
        characters.map(
          (character, index) => {
            const reference =
              characterReferences.find(
                (item) =>
                  item.characterId ===
                  character.identity
                    .characterId,
              );

            const heightUnits =
              reference?.canonicalIdentity
                .heightUnits ??
              referenceHeightUnits +
                index * 4;

            return {
              characterId:
                character.identity
                  .characterId,

              characterName:
                character.identity
                  .canonicalName,

              heightUnits,

              relativeScale:
                heightUnits /
                referenceHeightUnits,
            };
          },
        ),

      environmentScales:
        world.locations.map(
          (location) => ({
            locationName:
              location.name,

            scaleDescription:
              location.type ===
              'hidden-place'
                ? 'ممرات وأبواب أكبر قليلًا من الشخصيات لإظهار الغموض دون تهديد.'
                : 'أبواب ومقاعد وممرات متناسبة مع شخصيات الأطفال.',
          }),
        ),

      propScales:
        props.map(
          (prop) => ({
            propName:
              prop.propName,

            scaleDescription:
              prop.scaleDescription,
          }),
        ),

      rules: [
        'نُور هي مرجع القياس الأساسي بقيمة 100 وحدة.',
        'عدم تغيير طول الشخصية بين المشاهد.',
        'الحفاظ على فرق الطول بين الشخصيات.',
        'حجم الرأس والأطراف ثابت وفق Character Reference.',
        'الأدوات تبقى متناسبة مع اليد والوجه والجسم.',
        'الأبواب والأثاث ثابتة المقياس داخل الموقع نفسه.',
      ],
    };
  }
}
