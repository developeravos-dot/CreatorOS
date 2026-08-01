import { Test } from '@nestjs/testing';
import { ContinuityControlStageController } from './continuity-control-stage.controller';
import { ContinuityControlStageService } from './continuity-control-stage.service';

describe('ContinuityControlStageController', () => {
  let controller: ContinuityControlStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ContinuityControlStageController],
      providers: [ContinuityControlStageService],
    }).compile();

    controller = moduleRef.get(ContinuityControlStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
