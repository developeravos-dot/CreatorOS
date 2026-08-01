import { CapabilityRepository } from './capability.repository';

describe('CapabilityRepository', () => {
  const capabilityDelegate = {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const prisma = {
    capability: capabilityDelegate,
  };

  let repository: CapabilityRepository;

  beforeEach(() => {
    jest.clearAllMocks();

    repository = new CapabilityRepository(
      prisma as never,
    );
  });

  it('should create a capability', async () => {
    const data = {
      capabilityKey: 'content.production',
      domain: 'content',
      name: 'Content Production',
      contract: {},
      dependencies: [],
    };

    capabilityDelegate.create.mockResolvedValue({
      id: 'capability-1',
      ...data,
    });

    await repository.create(data);

    expect(
      capabilityDelegate.create,
    ).toHaveBeenCalledWith({
      data,
    });
  });

  it('should find a capability by id', async () => {
    capabilityDelegate.findUnique.mockResolvedValue({
      id: 'capability-1',
    });

    await repository.findById(
      'capability-1',
    );

    expect(
      capabilityDelegate.findUnique,
    ).toHaveBeenCalledWith({
      where: {
        id: 'capability-1',
      },
    });
  });

  it('should update a capability', async () => {
    capabilityDelegate.update.mockResolvedValue({
      id: 'capability-1',
      name: 'Updated Capability',
    });

    await repository.update(
      'capability-1',
      {
        name: 'Updated Capability',
      },
    );

    expect(
      capabilityDelegate.update,
    ).toHaveBeenCalledWith({
      where: {
        id: 'capability-1',
      },
      data: {
        name: 'Updated Capability',
      },
    });
  });

  it('should delete a capability', async () => {
    capabilityDelegate.delete.mockResolvedValue({
      id: 'capability-1',
    });

    await repository.delete(
      'capability-1',
    );

    expect(
      capabilityDelegate.delete,
    ).toHaveBeenCalledWith({
      where: {
        id: 'capability-1',
      },
    });
  });
});