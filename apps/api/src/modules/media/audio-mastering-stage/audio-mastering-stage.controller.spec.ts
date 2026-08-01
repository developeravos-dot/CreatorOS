import { Test } from '@nestjs/testing';
import { AudioMasteringStageController } from './audio-mastering-stage.controller';
import { AudioMasteringStageService } from './audio-mastering-stage.service';

describe('AudioMasteringStageController', () => {
  let controller: AudioMasteringStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AudioMasteringStageController],
      providers: [AudioMasteringStageService],
    }).compile();

    controller = moduleRef.get(AudioMasteringStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
