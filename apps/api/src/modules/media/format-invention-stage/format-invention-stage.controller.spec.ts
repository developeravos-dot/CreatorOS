import { Test } from '@nestjs/testing';
import { FormatInventionStageController } from './format-invention-stage.controller';
import { FormatInventionStageService } from './format-invention-stage.service';

describe('FormatInventionStageController', () => {
  let controller: FormatInventionStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FormatInventionStageController],
      providers: [FormatInventionStageService],
    }).compile();

    controller = moduleRef.get(FormatInventionStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
