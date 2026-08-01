import { Test } from '@nestjs/testing';
import { BrandBookStageController } from './brand-book-stage.controller';
import { BrandBookStageService } from './brand-book-stage.service';

describe('BrandBookStageController', () => {
  let controller: BrandBookStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BrandBookStageController],
      providers: [BrandBookStageService],
    }).compile();

    controller = moduleRef.get(BrandBookStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
