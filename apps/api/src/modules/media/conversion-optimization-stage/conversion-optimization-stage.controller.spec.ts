import { Test, TestingModule } from '@nestjs/testing';
import { ConversionOptimizationStageController } from './conversion-optimization-stage.controller';
import { ConversionOptimizationStageService } from './conversion-optimization-stage.service';

describe('ConversionOptimizationStageController', () => {
  let controller: ConversionOptimizationStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [ConversionOptimizationStageController], providers: [ConversionOptimizationStageService] }).compile();
    controller = module.get<ConversionOptimizationStageController>(ConversionOptimizationStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
