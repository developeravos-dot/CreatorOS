import { Test, TestingModule } from '@nestjs/testing';
import { RevenueStreamDesignStageController } from './revenue-stream-design-stage.controller';
import { RevenueStreamDesignStageService } from './revenue-stream-design-stage.service';

describe('RevenueStreamDesignStageController', () => {
  let controller: RevenueStreamDesignStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [RevenueStreamDesignStageController], providers: [RevenueStreamDesignStageService] }).compile();
    controller = module.get<RevenueStreamDesignStageController>(RevenueStreamDesignStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
