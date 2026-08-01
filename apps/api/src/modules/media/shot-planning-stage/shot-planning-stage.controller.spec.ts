import { Test } from '@nestjs/testing';
import { ShotPlanningStageController } from './shot-planning-stage.controller';
import { ShotPlanningStageService } from './shot-planning-stage.service';

describe('ShotPlanningStageController', () => {
  let controller: ShotPlanningStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ShotPlanningStageController],
      providers: [ShotPlanningStageService],
    }).compile();

    controller = moduleRef.get(ShotPlanningStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
