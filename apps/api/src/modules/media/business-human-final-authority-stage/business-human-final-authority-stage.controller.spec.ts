import { Test, TestingModule } from '@nestjs/testing';
import { BusinessHumanFinalAuthorityStageController } from './business-human-final-authority-stage.controller';
import { BusinessHumanFinalAuthorityStageService } from './business-human-final-authority-stage.service';

describe('BusinessHumanFinalAuthorityStageController', () => {
  let controller: BusinessHumanFinalAuthorityStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [BusinessHumanFinalAuthorityStageController], providers: [BusinessHumanFinalAuthorityStageService] }).compile();
    controller = module.get<BusinessHumanFinalAuthorityStageController>(BusinessHumanFinalAuthorityStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
