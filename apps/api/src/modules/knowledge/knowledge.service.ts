import { Injectable } from '@nestjs/common';
import {
  CreateKnowledgeObjectInput,
  CreateKnowledgeRelationInput,
  InMemoryKnowledgeStore,
  UpdateKnowledgeObjectInput,
} from '@creatoros/knowledge';

@Injectable()
export class KnowledgeService {
  private readonly store =
    new InMemoryKnowledgeStore();

  createObject(
    input: CreateKnowledgeObjectInput,
  ) {
    return this.store.createObject(input);
  }

  getObjects(query?: string) {
    const objects = query
      ? this.store.search(query)
      : this.store.getObjects();

    return {
      registry: 'knowledge-objects',
      status: 'operational',
      count: objects.length,
      objects,
    };
  }

  getObjectById(objectId: string) {
    return this.store.getObjectById(objectId);
  }

  updateObject(
    objectId: string,
    input: UpdateKnowledgeObjectInput,
  ) {
    return this.store.updateObject(
      objectId,
      input,
    );
  }

  getVersions(objectId: string) {
    const versions =
      this.store.getVersions(objectId);

    return {
      registry: 'knowledge-versions',
      status: 'operational',
      objectId,
      count: versions.length,
      versions,
    };
  }

  createRelation(
    input: CreateKnowledgeRelationInput,
  ) {
    return this.store.createRelation(input);
  }

  getRelations(objectId?: string) {
    const relations = objectId
      ? this.store.getRelationsForObject(objectId)
      : this.store.getRelations();

    return {
      registry: 'knowledge-relations',
      status: 'operational',
      count: relations.length,
      relations,
    };
  }

  getStatus() {
    return {
      module: 'knowledge',
      ...this.store.getStatus(),
    };
  }
}
