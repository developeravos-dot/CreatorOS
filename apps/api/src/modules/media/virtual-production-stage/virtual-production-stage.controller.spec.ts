import { Test } from '@nestjs/testing';
import { VirtualProductionStageController } from './virtual-production-stage.controller';
import { VirtualProductionStageService } from './virtual-production-stage.service';

describe('VirtualProductionStageController', () => {
  let controller: VirtualProductionStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [VirtualProductionStageController],
      providers: [VirtualProductionStageService],
    }).compile();

    controller = moduleRef.get(VirtualProductionStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
