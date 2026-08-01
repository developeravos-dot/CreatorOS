import { Test, TestingModule } from '@nestjs/testing';
import { BusinessClientSolutionsStageController } from './business-client-solutions-stage.controller';
import { BusinessClientSolutionsStageService } from './business-client-solutions-stage.service';

describe('BusinessClientSolutionsStageController', () => {
  let controller: BusinessClientSolutionsStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [BusinessClientSolutionsStageController], providers: [BusinessClientSolutionsStageService] }).compile();
    controller = module.get<BusinessClientSolutionsStageController>(BusinessClientSolutionsStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
