import { Injectable } from '@nestjs/common';

export interface EnterpriseKnowledgeRecord {
  readonly recordId: string;
  readonly namespace: string;
  readonly content: string;
  readonly tags: readonly string[];
  readonly version: number;
  readonly createdAt: Date;
}

@Injectable()
export class EnterpriseKnowledgeFabricService {
  private readonly records = new Map<string, EnterpriseKnowledgeRecord[]>();

  publish(input: { readonly recordId: string; readonly namespace: string; readonly content: string; readonly tags?: readonly string[]; readonly now?: Date }): EnterpriseKnowledgeRecord {
    const recordId = input.recordId.trim();
    const namespace = input.namespace.trim();
    const content = input.content.trim();
    if (!recordId || !namespace || !content) throw new Error('Valid knowledge record is required.');
    const history = this.records.get(recordId) ?? [];
    const record: EnterpriseKnowledgeRecord = {
      recordId,
      namespace,
      content,
      tags: [...new Set((input.tags ?? []).map((tag) => tag.trim()).filter(Boolean))],
      version: history.length + 1,
      createdAt: new Date(input.now ?? new Date()),
    };
    this.records.set(recordId, [...history, record]);
    return this.clone(record);
  }

  latest(recordId: string): EnterpriseKnowledgeRecord | null {
    const history = this.records.get(recordId.trim());
    const record = history?.[history.length - 1];
    return record ? this.clone(record) : null;
  }

  search(input: { readonly text?: string; readonly namespace?: string; readonly tags?: readonly string[] }): readonly EnterpriseKnowledgeRecord[] {
    const text = input.text?.trim().toLowerCase();
    const namespace = input.namespace?.trim();
    const tags = (input.tags ?? []).map((tag) => tag.trim().toLowerCase()).filter(Boolean);
    return [...this.records.values()]
      .map((history) => history[history.length - 1])
      .filter((record): record is EnterpriseKnowledgeRecord => record !== undefined)
      .filter((record) => !namespace || record.namespace === namespace)
      .filter((record) => !text || record.content.toLowerCase().includes(text) || record.tags.some((tag) => tag.toLowerCase().includes(text)))
      .filter((record) => tags.every((tag) => record.tags.some((item) => item.toLowerCase() === tag)))
      .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
      .map((record) => this.clone(record));
  }

  private clone(record: EnterpriseKnowledgeRecord): EnterpriseKnowledgeRecord {
    return { ...record, tags: [...record.tags], createdAt: new Date(record.createdAt) };
  }
}
