import { Test } from '@nestjs/testing';
import { CreativeAbTestingStageController } from './creative-ab-testing-stage.controller';
import { CreativeAbTestingStageService } from './creative-ab-testing-stage.service';

describe('CreativeAbTestingStageController', () => {
  let controller: CreativeAbTestingStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CreativeAbTestingStageController],
      providers: [CreativeAbTestingStageService],
    }).compile();

    controller = moduleRef.get(CreativeAbTestingStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
