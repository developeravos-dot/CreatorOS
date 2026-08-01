import { Injectable } from '@nestjs/common';
import {
  KnowledgeEdgeRepository,
  KnowledgeNodeRepository,
} from '../../persistence/repositories';

@Injectable()
export class KnowledgeApplicationService {
  constructor(
    private readonly nodes: KnowledgeNodeRepository,
    private readonly edges: KnowledgeEdgeRepository,
  ) {}

  createNode(
    data: Parameters<KnowledgeNodeRepository['create']>[0],
  ) {
    return this.nodes.create(data);
  }

  getNode(
    id: string,
  ) {
    return this.nodes.findById(id);
  }

  listNodes(
    where: Parameters<KnowledgeNodeRepository['findMany']>[0] = {},
  ) {
    return this.nodes.findMany(where);
  }

  updateNode(
    id: string,
    data: Parameters<KnowledgeNodeRepository['update']>[1],
  ) {
    return this.nodes.update(
      id,
      data,
    );
  }

  removeNode(
    id: string,
  ) {
    return this.nodes.delete(id);
  }

  createEdge(
    data: Parameters<KnowledgeEdgeRepository['create']>[0],
  ) {
    return this.edges.create(data);
  }

  getEdge(
    id: string,
  ) {
    return this.edges.findById(id);
  }

  listEdges(
    where: Parameters<KnowledgeEdgeRepository['findMany']>[0] = {},
  ) {
    return this.edges.findMany(where);
  }

  updateEdge(
    id: string,
    data: Parameters<KnowledgeEdgeRepository['update']>[1],
  ) {
    return this.edges.update(
      id,
      data,
    );
  }

  removeEdge(
    id: string,
  ) {
    return this.edges.delete(id);
  }
}