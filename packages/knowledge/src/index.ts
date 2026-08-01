import { randomUUID } from 'node:crypto';

export type KnowledgeObjectStatus =
  | 'draft'
  | 'active'
  | 'archived';

export type KnowledgeObjectType =
  | 'idea'
  | 'concept'
  | 'decision'
  | 'document'
  | 'project'
  | 'capability'
  | 'domain'
  | 'custom';

export type KnowledgeRelationType =
  | 'related-to'
  | 'depends-on'
  | 'part-of'
  | 'derived-from'
  | 'supports'
  | 'contradicts'
  | 'supersedes'
  | 'custom';

export interface KnowledgeObjectMetadata {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
}

export interface KnowledgeObject<TContent = unknown> {
  id: string;
  type: KnowledgeObjectType;
  title: string;
  description?: string;
  content: TContent;
  status: KnowledgeObjectStatus;
  version: number;
  metadata: KnowledgeObjectMetadata;
}

export interface KnowledgeRelation {
  id: string;
  sourceId: string;
  targetId: string;
  type: KnowledgeRelationType;
  description?: string;
  createdAt: string;
}

export interface KnowledgeVersion<TContent = unknown> {
  id: string;
  objectId: string;
  version: number;
  content: TContent;
  createdAt: string;
  createdBy: string;
}

export interface CreateKnowledgeObjectInput<TContent = unknown> {
  type: KnowledgeObjectType;
  title: string;
  description?: string;
  content: TContent;
  status?: KnowledgeObjectStatus;
  createdBy?: string;
  tags?: string[];
}

export interface UpdateKnowledgeObjectInput<TContent = unknown> {
  title?: string;
  description?: string;
  content?: TContent;
  status?: KnowledgeObjectStatus;
  updatedBy?: string;
  tags?: string[];
}

export interface CreateKnowledgeRelationInput {
  sourceId: string;
  targetId: string;
  type: KnowledgeRelationType;
  description?: string;
}

export class KnowledgeObjectNotFoundError extends Error {
  constructor(objectId: string) {
    super(`Knowledge object ${objectId} was not found`);
    this.name = 'KnowledgeObjectNotFoundError';
  }
}

export class InvalidKnowledgeRelationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidKnowledgeRelationError';
  }
}

export class InMemoryKnowledgeStore {
  private readonly objects =
    new Map<string, KnowledgeObject>();

  private readonly relations =
    new Map<string, KnowledgeRelation>();

  private readonly versions =
    new Map<string, KnowledgeVersion[]>();

  createObject<TContent>(
    input: CreateKnowledgeObjectInput<TContent>,
  ): KnowledgeObject<TContent> {
    const timestamp = new Date().toISOString();
    const objectId = randomUUID();

    const knowledgeObject: KnowledgeObject<TContent> = {
      id: objectId,
      type: input.type,
      title: input.title,
      description: input.description,
      content: input.content,
      status: input.status ?? 'active',
      version: 1,
      metadata: {
        createdAt: timestamp,
        updatedAt: timestamp,
        createdBy: input.createdBy ?? 'system',
        tags: input.tags ?? [],
      },
    };

    this.objects.set(
      objectId,
      knowledgeObject as KnowledgeObject,
    );

    this.versions.set(objectId, [
      {
        id: randomUUID(),
        objectId,
        version: 1,
        content: input.content,
        createdAt: timestamp,
        createdBy: input.createdBy ?? 'system',
      },
    ]);

    return knowledgeObject;
  }

  getObjects(): KnowledgeObject[] {
    return Array.from(this.objects.values());
  }

  getObjectById(
    objectId: string,
  ): KnowledgeObject | undefined {
    return this.objects.get(objectId);
  }

  updateObject<TContent>(
    objectId: string,
    input: UpdateKnowledgeObjectInput<TContent>,
  ): KnowledgeObject {
    const currentObject =
      this.objects.get(objectId);

    if (!currentObject) {
      throw new KnowledgeObjectNotFoundError(objectId);
    }

    const timestamp = new Date().toISOString();
    const nextVersion = currentObject.version + 1;

    const updatedObject: KnowledgeObject = {
      ...currentObject,
      title: input.title ?? currentObject.title,
      description:
        input.description ?? currentObject.description,
      content:
        input.content ?? currentObject.content,
      status:
        input.status ?? currentObject.status,
      version: nextVersion,
      metadata: {
        ...currentObject.metadata,
        updatedAt: timestamp,
        tags:
          input.tags ?? currentObject.metadata.tags,
      },
    };

    this.objects.set(objectId, updatedObject);

    const objectVersions =
      this.versions.get(objectId) ?? [];

    objectVersions.push({
      id: randomUUID(),
      objectId,
      version: nextVersion,
      content: updatedObject.content,
      createdAt: timestamp,
      createdBy: input.updatedBy ?? 'system',
    });

    this.versions.set(
      objectId,
      objectVersions,
    );

    return updatedObject;
  }

  getVersions(
    objectId: string,
  ): KnowledgeVersion[] {
    if (!this.objects.has(objectId)) {
      throw new KnowledgeObjectNotFoundError(objectId);
    }

    return this.versions.get(objectId) ?? [];
  }

  createRelation(
    input: CreateKnowledgeRelationInput,
  ): KnowledgeRelation {
    if (!this.objects.has(input.sourceId)) {
      throw new KnowledgeObjectNotFoundError(
        input.sourceId,
      );
    }

    if (!this.objects.has(input.targetId)) {
      throw new KnowledgeObjectNotFoundError(
        input.targetId,
      );
    }

    if (input.sourceId === input.targetId) {
      throw new InvalidKnowledgeRelationError(
        'A knowledge object cannot relate to itself',
      );
    }

    const relation: KnowledgeRelation = {
      id: randomUUID(),
      sourceId: input.sourceId,
      targetId: input.targetId,
      type: input.type,
      description: input.description,
      createdAt: new Date().toISOString(),
    };

    this.relations.set(
      relation.id,
      relation,
    );

    return relation;
  }

  getRelations(): KnowledgeRelation[] {
    return Array.from(this.relations.values());
  }

  getRelationsForObject(
    objectId: string,
  ): KnowledgeRelation[] {
    if (!this.objects.has(objectId)) {
      throw new KnowledgeObjectNotFoundError(objectId);
    }

    return this.getRelations().filter(
      (relation) =>
        relation.sourceId === objectId ||
        relation.targetId === objectId,
    );
  }

  search(query: string): KnowledgeObject[] {
    const normalizedQuery =
      query.trim().toLowerCase();

    if (!normalizedQuery) {
      return this.getObjects();
    }

    return this.getObjects().filter((object) => {
      const searchableText = [
        object.title,
        object.description ?? '',
        object.type,
        object.metadata.tags.join(' '),
        JSON.stringify(object.content),
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(
        normalizedQuery,
      );
    });
  }

  getStatus() {
    return {
      package: '@creatoros/knowledge',
      status: 'operational' as const,
      provider: 'InMemoryKnowledgeStore',
      objects: this.objects.size,
      relations: this.relations.size,
      versions: Array.from(
        this.versions.values(),
      ).reduce(
        (total, objectVersions) =>
          total + objectVersions.length,
        0,
      ),
    };
  }
}
