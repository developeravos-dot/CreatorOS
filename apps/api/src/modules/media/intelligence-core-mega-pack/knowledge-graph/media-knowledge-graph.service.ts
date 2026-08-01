import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  IntelligenceCoreBrief,
  KnowledgeEdge,
  KnowledgeNode,
} from '../intelligence-core.types';

@Injectable()
export class MediaKnowledgeGraphService {
  build(brief: IntelligenceCoreBrief): {
    nodes: KnowledgeNode[];
    edges: KnowledgeEdge[];
  } {
    const projectNode: KnowledgeNode = {
      id: randomUUID(),
      type: 'project',
      label: brief.title,
      properties: {
        projectId: brief.projectId,
        domain: brief.domain,
      },
    };

    const objectiveNodes = brief.objectives.map((objective) => ({
      id: randomUUID(),
      type: 'objective',
      label: objective,
      properties: {
        status: 'active',
      },
    }));

    const sourceNodes = (brief.dataSources ?? []).map((source) => ({
      id: randomUUID(),
      type: 'data-source',
      label: source,
      properties: {
        trustStatus: 'requires-validation',
      },
    }));

    const nodes = [projectNode, ...objectiveNodes, ...sourceNodes];

    const objectiveEdges: KnowledgeEdge[] = objectiveNodes.map((node) => ({
      id: randomUUID(),
      from: projectNode.id,
      to: node.id,
      relation: 'pursues',
      weight: 1,
      evidence: ['project-brief'],
    }));

    const sourceEdges: KnowledgeEdge[] = sourceNodes.map((node) => ({
      id: randomUUID(),
      from: node.id,
      to: projectNode.id,
      relation: 'informs',
      weight: 0.7,
      evidence: ['declared-data-source'],
    }));

    return {
      nodes,
      edges: [...objectiveEdges, ...sourceEdges],
    };
  }

  addRelationship(
    graph: { nodes: KnowledgeNode[]; edges: KnowledgeEdge[] },
    from: string,
    to: string,
    relation: string,
    evidence: string[],
  ) {
    if (
      !graph.nodes.some((node) => node.id === from) ||
      !graph.nodes.some((node) => node.id === to)
    ) {
      throw new Error('Knowledge graph nodes must exist before linking.');
    }

    graph.edges.push({
      id: randomUUID(),
      from,
      to,
      relation,
      weight: 0.8,
      evidence,
    });

    return graph;
  }
}