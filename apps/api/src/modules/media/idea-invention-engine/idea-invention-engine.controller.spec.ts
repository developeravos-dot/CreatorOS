import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  IdeaInventionEngineController,
} from './idea-invention-engine.controller';

import {
  IdeaInventionEngineService,
} from './idea-invention-engine.service';

describe('IdeaInventionEngineController', () => {
  let controller: IdeaInventionEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          IdeaInventionEngineController,
        ],
        providers: [
          IdeaInventionEngineService,
        ],
      }).compile();

    controller =
      module.get<IdeaInventionEngineController>(
        IdeaInventionEngineController,
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
