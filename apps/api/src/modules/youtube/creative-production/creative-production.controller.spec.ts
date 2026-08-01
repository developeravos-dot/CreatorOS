import { Test, TestingModule } from '@nestjs/testing';

import { CreativeProductionController } from './creative-production.controller';
import { CreativeProductionService } from './creative-production.service';

describe('CreativeProductionController', () => {
  let controller: CreativeProductionController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [CreativeProductionController],
        providers: [CreativeProductionService],
      }).compile();

    controller =
      module.get<CreativeProductionController>(
        CreativeProductionController,
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
