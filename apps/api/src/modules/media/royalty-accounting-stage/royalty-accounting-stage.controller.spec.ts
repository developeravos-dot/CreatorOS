import { Test, TestingModule } from '@nestjs/testing';
import { RoyaltyAccountingStageController } from './royalty-accounting-stage.controller';
import { RoyaltyAccountingStageService } from './royalty-accounting-stage.service';

describe('RoyaltyAccountingStageController', () => {
  let controller: RoyaltyAccountingStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [RoyaltyAccountingStageController], providers: [RoyaltyAccountingStageService] }).compile();
    controller = module.get<RoyaltyAccountingStageController>(RoyaltyAccountingStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
