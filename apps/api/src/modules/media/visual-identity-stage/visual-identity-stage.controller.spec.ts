import { Test } from '@nestjs/testing';
import { VisualIdentityStageController } from './visual-identity-stage.controller';
import { VisualIdentityStageService } from './visual-identity-stage.service';

describe('VisualIdentityStageController', () => {
  let controller: VisualIdentityStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [VisualIdentityStageController],
      providers: [VisualIdentityStageService],
    }).compile();

    controller = moduleRef.get(VisualIdentityStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
