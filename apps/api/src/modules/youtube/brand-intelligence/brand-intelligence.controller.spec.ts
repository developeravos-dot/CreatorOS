import { Test, TestingModule } from '@nestjs/testing';

import { BrandIntelligenceController } from './brand-intelligence.controller';
import { BrandIntelligenceService } from './brand-intelligence.service';

describe('BrandIntelligenceController', () => {
  let controller: BrandIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [BrandIntelligenceController],
        providers: [BrandIntelligenceService],
      }).compile();

    controller =
      module.get<BrandIntelligenceController>(
        BrandIntelligenceController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an operational dashboard', () => {
    const dashboard = controller.getDashboard();

    expect(dashboard.status).toBe('operational');
  });
});
