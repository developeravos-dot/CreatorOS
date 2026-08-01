import { Test } from '@nestjs/testing';
import { CharacterDevelopmentStageController } from './character-development-stage.controller';
import { CharacterDevelopmentStageService } from './character-development-stage.service';

describe('CharacterDevelopmentStageController', () => {
  let controller: CharacterDevelopmentStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CharacterDevelopmentStageController],
      providers: [CharacterDevelopmentStageService],
    }).compile();

    controller = moduleRef.get(CharacterDevelopmentStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
