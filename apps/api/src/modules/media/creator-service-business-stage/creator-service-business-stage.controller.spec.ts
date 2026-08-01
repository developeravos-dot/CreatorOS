import { Test, TestingModule } from '@nestjs/testing';
import { CreatorServiceBusinessStageController } from './creator-service-business-stage.controller';
import { CreatorServiceBusinessStageService } from './creator-service-business-stage.service';

describe('CreatorServiceBusinessStageController', () => {
  let controller: CreatorServiceBusinessStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [CreatorServiceBusinessStageController], providers: [CreatorServiceBusinessStageService] }).compile();
    controller = module.get<CreatorServiceBusinessStageController>(CreatorServiceBusinessStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
