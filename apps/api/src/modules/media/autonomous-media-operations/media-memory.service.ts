import { Injectable } from '@nestjs/common';
import { MediaMemoryEntry } from './autonomous-media-operations.types';

@Injectable()
export class MediaMemoryService {
  private readonly entries: MediaMemoryEntry[] = [];

  remember(projectId: string, category: string, summary: string, evidence: Record<string, unknown> = {}) {
    const entry: MediaMemoryEntry = {
      id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      projectId,
      category,
      summary,
      createdAt: new Date().toISOString(),
      evidence,
    };
    this.entries.push(entry);
    return entry;
  }

  list(projectId?: string) {
    return projectId ? this.entries.filter((entry) => entry.projectId === projectId) : [...this.entries];
  }

  latest(projectId: string, limit = 20) {
    return this.entries
      .filter((entry) => entry.projectId === projectId)
      .slice(-Math.max(1, limit))
      .reverse();
  }
}
