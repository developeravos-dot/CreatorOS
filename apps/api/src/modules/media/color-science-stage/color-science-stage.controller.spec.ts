import { Test } from '@nestjs/testing';
import { ColorScienceStageController } from './color-science-stage.controller';
import { ColorScienceStageService } from './color-science-stage.service';

describe('ColorScienceStageController', () => {
  let controller: ColorScienceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ColorScienceStageController],
      providers: [ColorScienceStageService],
    }).compile();

    controller = moduleRef.get(ColorScienceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
