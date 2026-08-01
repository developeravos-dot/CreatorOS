import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  IdeaGeneratorController,
} from './idea-generator.controller';

import {
  IdeaGeneratorService,
} from './idea-generator.service';

describe('IdeaGeneratorController', () => {
  let controller: IdeaGeneratorController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [IdeaGeneratorController],
        providers: [IdeaGeneratorService],
      }).compile();

    controller =
      module.get<IdeaGeneratorController>(
        IdeaGeneratorController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return operational dashboard', () => {
    expect(controller.getDashboard().status).toBe(
      'operational',
    );
  });

  it('should create a production record', () => {
    const record = controller.createRecord({
      title: 'Controller Asset',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
