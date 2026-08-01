import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ContentConceptLabController,
} from './content-concept-lab.controller';

import {
  ContentConceptLabService,
} from './content-concept-lab.service';

describe('ContentConceptLabController', () => {
  let controller: ContentConceptLabController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          ContentConceptLabController,
        ],
        providers: [
          ContentConceptLabService,
        ],
      }).compile();

    controller =
      module.get<ContentConceptLabController>(
        ContentConceptLabController,
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
