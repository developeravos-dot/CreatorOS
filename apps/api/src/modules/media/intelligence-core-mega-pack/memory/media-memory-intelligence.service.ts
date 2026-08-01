import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MemoryRecord } from '../intelligence-core.types';

@Injectable()
export class MediaMemoryIntelligenceService {
  remember(
    category: string,
    summary: string,
    source: string,
    tags: string[],
    importance: number,
    previousVersion?: MemoryRecord,
  ): MemoryRecord {
    return {
      id: previousVersion?.id ?? randomUUID(),
      createdAt: new Date().toISOString(),
      category,
      summary,
      source,
      tags: [...new Set(tags)],
      importance: Math.max(0, Math.min(1, importance)),
      version: (previousVersion?.version ?? 0) + 1,
    };
  }

  search(
    records: MemoryRecord[],
    query: string,
  ): MemoryRecord[] {
    const normalized = query.trim().toLowerCase();

    return records
      .filter((record) =>
        `${record.category} ${record.summary} ${record.tags.join(' ')}`
          .toLowerCase()
          .includes(normalized),
      )
      .sort((a, b) => b.importance - a.importance);
  }
}