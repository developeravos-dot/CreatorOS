import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  KnowledgeRecord,
  KnowledgeRecordType,
} from '../intelligence-core.types';

@Injectable()
export class KnowledgeFabricService {
  private readonly records = new Map<
    string,
    KnowledgeRecord
  >();

  upsert(input: {
    key: string;
    type: KnowledgeRecordType;
    title: string;
    content: string;
    tags?: string[];
    source: string;
    metadata?: Record<string, unknown>;
  }): KnowledgeRecord {
    const current = this.records.get(input.key);
    const now = new Date().toISOString();

    const record: KnowledgeRecord = {
      id: current?.id ?? randomUUID(),
      key: input.key,
      type: input.type,
      title: input.title,
      content: input.content,
      tags: input.tags ?? [],
      source: input.source,
      version: (current?.version ?? 0) + 1,
      createdAt: current?.createdAt ?? now,
      updatedAt: now,
      metadata: input.metadata ?? {},
    };

    this.records.set(input.key, record);
    return record;
  }

  get(key: string) {
    const record = this.records.get(key);

    if (!record) {
      throw new Error(
        `Knowledge record not found: ${key}`,
      );
    }

    return record;
  }

  search(query: string) {
    const normalized = query.toLowerCase();

    return [...this.records.values()].filter(
      (record) =>
        record.key
          .toLowerCase()
          .includes(normalized) ||
        record.title
          .toLowerCase()
          .includes(normalized) ||
        record.content
          .toLowerCase()
          .includes(normalized) ||
        record.tags.some((tag) =>
          tag
            .toLowerCase()
            .includes(normalized),
        ),
    );
  }

  list() {
    return [...this.records.values()];
  }

  summary() {
    const records = this.list();

    return {
      total: records.length,
      versions: records.reduce(
        (sum, item) => sum + item.version,
        0,
      ),
      byType: records.reduce<
        Record<string, number>
      >((acc, item) => {
        acc[item.type] =
          (acc[item.type] ?? 0) + 1;
        return acc;
      }, {}),
    };
  }
}