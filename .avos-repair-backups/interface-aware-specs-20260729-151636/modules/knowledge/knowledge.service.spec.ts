import { KnowledgeService } from './knowledge.service';

describe('KnowledgeService', () => {
  let service: KnowledgeService;

  beforeEach(() => {
    service = new KnowledgeService();
  });

  it('should report operational status', () => {
    expect(service.getStatus()).toEqual({
      module: 'knowledge',
      package: '@creatoros/knowledge',
      status: 'operational',
      provider: 'InMemoryKnowledgeStore',
      objects: 0,
      relations: 0,
      versions: 0,
    });
  });

  it('should create and retrieve a knowledge object', () => {
    const created = service.createObject({
      type: 'idea',
      title: 'Living Vision',
      description:
        'Continuously evolving strategic intelligence.',
      content: {
        purpose: 'Preserve and evolve ideas',
      },
      tags: [
        'avos',
        'living-vision',
      ],
    });

    const retrieved =
      service.getObjectById(created.id);

    expect(retrieved).toEqual(created);
    expect(created.version).toBe(1);
  });

  it('should update an object and create a new version', () => {
    const created = service.createObject({
      type: 'concept',
      title: 'Knowledge Graph',
      content: {
        state: 'initial',
      },
    });

    const updated = service.updateObject(
      created.id,
      {
        content: {
          state: 'expanded',
        },
      },
    );

    const versions =
      service.getVersions(created.id);

    expect(updated.version).toBe(2);
    expect(versions.count).toBe(2);
  });

  it('should create a relation between objects', () => {
    const source = service.createObject({
      type: 'idea',
      title: 'Living Vision',
      content: {},
    });

    const target = service.createObject({
      type: 'capability',
      title: 'Knowledge Foundation',
      content: {},
    });

    const relation =
      service.createRelation({
        sourceId: source.id,
        targetId: target.id,
        type: 'depends-on',
      });

    expect(relation.sourceId).toBe(source.id);
    expect(relation.targetId).toBe(target.id);
    expect(
      service.getRelations().count,
    ).toBe(1);
  });

  it('should search knowledge objects', () => {
    service.createObject({
      type: 'idea',
      title: 'AVOS Living Vision',
      content: {},
      tags: ['strategy'],
    });

    service.createObject({
      type: 'project',
      title: 'Creator Media',
      content: {},
      tags: ['media'],
    });

    const result =
      service.getObjects('Living Vision');

    expect(result.count).toBe(1);
    expect(result.objects[0]?.title)
      .toBe('AVOS Living Vision');
  });
});
