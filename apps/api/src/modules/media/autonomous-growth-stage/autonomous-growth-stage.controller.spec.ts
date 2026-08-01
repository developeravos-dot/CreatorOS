import { Test, TestingModule } from '@nestjs/testing';
import { AutonomousGrowthStageController } from './autonomous-growth-stage.controller';
import { AutonomousGrowthStageService } from './autonomous-growth-stage.service';

describe('AutonomousGrowthStageController', () => {
  let controller: AutonomousGrowthStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [AutonomousGrowthStageController], providers: [AutonomousGrowthStageService] }).compile();
    controller = module.get<AutonomousGrowthStageController>(AutonomousGrowthStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
