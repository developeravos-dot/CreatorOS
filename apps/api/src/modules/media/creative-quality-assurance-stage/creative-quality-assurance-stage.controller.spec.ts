import { Test } from '@nestjs/testing';
import { CreativeQualityAssuranceStageController } from './creative-quality-assurance-stage.controller';
import { CreativeQualityAssuranceStageService } from './creative-quality-assurance-stage.service';

describe('CreativeQualityAssuranceStageController', () => {
  let controller: CreativeQualityAssuranceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CreativeQualityAssuranceStageController],
      providers: [CreativeQualityAssuranceStageService],
    }).compile();

    controller = moduleRef.get(CreativeQualityAssuranceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
