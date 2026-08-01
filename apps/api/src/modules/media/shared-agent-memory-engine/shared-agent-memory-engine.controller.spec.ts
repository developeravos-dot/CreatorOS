import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  SharedAgentMemoryEngineController,
} from './shared-agent-memory-engine.controller';

import {
  SharedAgentMemoryEngineService,
} from './shared-agent-memory-engine.service';

describe('SharedAgentMemoryEngineController', () => {
  let controller: SharedAgentMemoryEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          SharedAgentMemoryEngineController,
        ],
        providers: [
          SharedAgentMemoryEngineService,
        ],
      }).compile();

    controller =
      module.get<SharedAgentMemoryEngineController>(
        SharedAgentMemoryEngineController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(
      controller.getDashboard().status,
    ).toBe('operational');
  });
});
