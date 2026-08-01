import { CapabilityController } from './capability.controller';

describe('CapabilityController', () => {
  const service = {
    create: jest.fn(),
    list: jest.fn(),
    count: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  let controller: CapabilityController;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new CapabilityController(
      service as never,
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

    service.create.mockResolvedValue({
      id: 'capability-1',
      ...data,
    });

    await controller.create(data);

    expect(
      service.create,
    ).toHaveBeenCalledWith(data);
  });

  it('should list capabilities', async () => {
    service.list.mockResolvedValue([]);

    await controller.list();

    expect(
      service.list,
    ).toHaveBeenCalledWith({});
  });

  it('should retrieve a capability', async () => {
    service.getById.mockResolvedValue({
      id: 'capability-1',
    });

    await controller.getById(
      'capability-1',
    );

    expect(
      service.getById,
    ).toHaveBeenCalledWith(
      'capability-1',
    );
  });

  it('should update a capability', async () => {
    const data = {
      name: 'Updated Capability',
    };

    service.update.mockResolvedValue({
      id: 'capability-1',
      ...data,
    });

    await controller.update(
      'capability-1',
      data,
    );

    expect(
      service.update,
    ).toHaveBeenCalledWith(
      'capability-1',
      data,
    );
  });

  it('should remove a capability', async () => {
    service.remove.mockResolvedValue({
      id: 'capability-1',
    });

    await controller.remove(
      'capability-1',
    );

    expect(
      service.remove,
    ).toHaveBeenCalledWith(
      'capability-1',
    );
  });
});