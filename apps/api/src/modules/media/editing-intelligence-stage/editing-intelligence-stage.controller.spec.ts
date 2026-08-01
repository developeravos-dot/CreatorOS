import { Test } from '@nestjs/testing';
import { EditingIntelligenceStageController } from './editing-intelligence-stage.controller';
import { EditingIntelligenceStageService } from './editing-intelligence-stage.service';

describe('EditingIntelligenceStageController', () => {
  let controller: EditingIntelligenceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EditingIntelligenceStageController],
      providers: [EditingIntelligenceStageService],
    }).compile();

    controller = moduleRef.get(EditingIntelligenceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
