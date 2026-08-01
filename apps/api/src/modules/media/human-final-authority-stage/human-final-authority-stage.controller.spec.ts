import { Test } from '@nestjs/testing';
import { HumanFinalAuthorityStageController } from './human-final-authority-stage.controller';
import { HumanFinalAuthorityStageService } from './human-final-authority-stage.service';

describe('HumanFinalAuthorityStageController', () => {
  let controller: HumanFinalAuthorityStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HumanFinalAuthorityStageController],
      providers: [HumanFinalAuthorityStageService],
    }).compile();

    controller = moduleRef.get(HumanFinalAuthorityStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
