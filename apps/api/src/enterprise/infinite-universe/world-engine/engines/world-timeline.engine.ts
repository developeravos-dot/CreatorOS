import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import type {
  TimelineEvent,
  UniverseDna,
} from '../models/world-engine.models';

@Injectable()
export class WorldTimelineEngine {
  createInitialTimeline(
    dna: UniverseDna,
  ): TimelineEvent[] {
    return [
      {
        id: randomUUID(),
        worldYear: 0,
        title: 'تأسيس العالم المعروف',
        description:
          `بداية التاريخ المسجل لعالم ${dna.name}.`,
        eventType: 'discovery',
        importance: 100,
        affectedEntities: [
          dna.name,
        ],
        unresolvedConsequences: [
          'من كان موجودًا قبل التاريخ المسجل؟',
        ],
      },

      {
        id: randomUUID(),
        worldYear: 8,
        title: 'انقسام البنائين والحراس',
        description:
          'خلاف حول استخدام المعرفة تسبب في ظهور قوتين متنافستين.',
        eventType: 'political',
        importance: 90,
        affectedEntities: [
          'مجتمع البنائين',
          'مجتمع الحراس',
        ],
        unresolvedConsequences: [
          'سر الخلاف الأصلي',
          'إمكانية عودة الوحدة',
        ],
      },

      {
        id: randomUUID(),
        worldYear: 14,
        title: 'ظهور الأرشيف المخفي',
        description:
          'تم اكتشاف إشارات إلى أرشيف يحتوي على ذاكرة أقدم من العالم المسجل.',
        eventType: 'mystery',
        importance: 95,
        affectedEntities: [
          'هيئة الذاكرة',
          'الباحثون عن الحقيقة',
        ],
        unresolvedConsequences: [
          'موقع الأرشيف الحقيقي',
          'هوية من أنشأه',
          'سبب إخفائه',
        ],
      },
    ];
  }
}
