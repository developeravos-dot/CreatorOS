import { Test, TestingModule } from '@nestjs/testing';
import { CustomerLifetimeValueStageController } from './customer-lifetime-value-stage.controller';
import { CustomerLifetimeValueStageService } from './customer-lifetime-value-stage.service';

describe('CustomerLifetimeValueStageController', () => {
  let controller: CustomerLifetimeValueStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [CustomerLifetimeValueStageController], providers: [CustomerLifetimeValueStageService] }).compile();
    controller = module.get<CustomerLifetimeValueStageController>(CustomerLifetimeValueStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
