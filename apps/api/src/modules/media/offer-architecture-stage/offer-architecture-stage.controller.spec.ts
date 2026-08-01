import { Test, TestingModule } from '@nestjs/testing';
import { OfferArchitectureStageController } from './offer-architecture-stage.controller';
import { OfferArchitectureStageService } from './offer-architecture-stage.service';

describe('OfferArchitectureStageController', () => {
  let controller: OfferArchitectureStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [OfferArchitectureStageController], providers: [OfferArchitectureStageService] }).compile();
    controller = module.get<OfferArchitectureStageController>(OfferArchitectureStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
