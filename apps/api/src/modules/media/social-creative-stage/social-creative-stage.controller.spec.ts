import { Test } from '@nestjs/testing';
import { SocialCreativeStageController } from './social-creative-stage.controller';
import { SocialCreativeStageService } from './social-creative-stage.service';

describe('SocialCreativeStageController', () => {
  let controller: SocialCreativeStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SocialCreativeStageController],
      providers: [SocialCreativeStageService],
    }).compile();

    controller = moduleRef.get(SocialCreativeStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
