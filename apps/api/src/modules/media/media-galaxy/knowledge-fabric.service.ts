import { Injectable } from '@nestjs/common';

@Injectable()
export class KnowledgeFabricService {
  private readonly memories: Array<Record<string, unknown>> = [];

  architecture() {
    return {
      graph: ['projects', 'brands', 'content', 'audiences', 'channels', 'markets', 'decisions', 'outcomes'],
      memoryTypes: ['media memory', 'decision memory', 'learning memory', 'relationship memory'],
      retrieval: 'project-aware semantic and relationship retrieval',
      learningLoop: 'outcome -> evidence -> lesson -> updated recommendation',
    };
  }

  remember(projectId: string, category: string, summary: string, evidence: Record<string, unknown> = {}) {
    const memory = { id: `memory-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, projectId, category, summary, evidence, createdAt: new Date().toISOString() };
    this.memories.push(memory);
    return memory;
  }

  list(projectId?: string) {
    return projectId ? this.memories.filter((item) => item.projectId === projectId) : [...this.memories];
  }
}
