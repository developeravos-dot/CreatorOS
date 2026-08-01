import { KnowledgeApplicationService } from './knowledge-application.service';

describe('KnowledgeApplicationService', () => {
  const nodes = {
    create: jest.fn(),
    findById: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const edges = {
    create: jest.fn(),
    findById: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  let service: KnowledgeApplicationService;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new KnowledgeApplicationService(
      nodes as never,
      edges as never,
    );
  });

  it('should create a knowledge node', async () => {
    const data = {
      nodeKey: 'vision.creatoros',
      type: 'vision',
      name: 'CreatorOS Vision',
      content: {},
      properties: {},
    };

    nodes.create.mockResolvedValue({
      id: 'node-1',
      ...data,
    });

    await service.createNode(data);

    expect(
      nodes.create,
    ).toHaveBeenCalledWith(data);
  });

  it('should list knowledge edges', async () => {
    edges.findMany.mockResolvedValue([]);

    await service.listEdges({});

    expect(
      edges.findMany,
    ).toHaveBeenCalledWith({});
  });
});