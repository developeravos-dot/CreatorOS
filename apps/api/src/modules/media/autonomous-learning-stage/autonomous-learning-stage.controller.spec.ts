import { Test } from '@nestjs/testing';
import { AutonomousLearningStageController } from './autonomous-learning-stage.controller';
import { AutonomousLearningStageService } from './autonomous-learning-stage.service';

describe('AutonomousLearningStageController', () => {
  let controller: AutonomousLearningStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AutonomousLearningStageController],
      providers: [AutonomousLearningStageService],
    }).compile();

    controller = moduleRef.get(AutonomousLearningStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
