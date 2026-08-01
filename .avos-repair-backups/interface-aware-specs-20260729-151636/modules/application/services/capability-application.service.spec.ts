import { CapabilityApplicationService } from './capability-application.service';

describe('CapabilityApplicationService', () => {
  const repository = {
    create: jest.fn(),
    findById: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  let service: CapabilityApplicationService;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new CapabilityApplicationService(
      repository as never,
    );
  });

  it('should create a capability through repository', async () => {
    const data = {
      capabilityKey: 'content.production',
      domain: 'content',
      name: 'Content Production',
      contract: {},
      dependencies: [],
    };

    repository.create.mockResolvedValue({
      id: 'capability-1',
      ...data,
    });

    await service.create(data);

    expect(
      repository.create,
    ).toHaveBeenCalledWith(data);
  });

  it('should retrieve a capability by id', async () => {
    repository.findById.mockResolvedValue({
      id: 'capability-1',
    });

    await service.getById(
      'capability-1',
    );

    expect(
      repository.findById,
    ).toHaveBeenCalledWith(
      'capability-1',
    );
  });

  it('should update a capability', async () => {
    const data = {
      name: 'Updated Capability',
    };

    repository.update.mockResolvedValue({
      id: 'capability-1',
      ...data,
    });

    await service.update(
      'capability-1',
      data,
    );

    expect(
      repository.update,
    ).toHaveBeenCalledWith(
      'capability-1',
      data,
    );
  });

  it('should remove a capability', async () => {
    repository.delete.mockResolvedValue({
      id: 'capability-1',
    });

    await service.remove(
      'capability-1',
    );

    expect(
      repository.delete,
    ).toHaveBeenCalledWith(
      'capability-1',
    );
  });
});