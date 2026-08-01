import { Test } from '@nestjs/testing';
import { BrandNamingStageController } from './brand-naming-stage.controller';
import { BrandNamingStageService } from './brand-naming-stage.service';

describe('BrandNamingStageController', () => {
  let controller: BrandNamingStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BrandNamingStageController],
      providers: [BrandNamingStageService],
    }).compile();

    controller = moduleRef.get(BrandNamingStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
