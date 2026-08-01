import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  CreativeAiCouncilController,
} from './creative-ai-council.controller';

import {
  CreativeAiCouncilService,
} from './creative-ai-council.service';

describe('CreativeAiCouncilController', () => {
  let controller: CreativeAiCouncilController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          CreativeAiCouncilController,
        ],
        providers: [
          CreativeAiCouncilService,
        ],
      }).compile();

    controller =
      module.get<CreativeAiCouncilController>(
        CreativeAiCouncilController,
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
