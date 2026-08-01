import { Test } from '@nestjs/testing';
import { IpExpansionStageController } from './ip-expansion-stage.controller';
import { IpExpansionStageService } from './ip-expansion-stage.service';

describe('IpExpansionStageController', () => {
  let controller: IpExpansionStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [IpExpansionStageController],
      providers: [IpExpansionStageService],
    }).compile();

    controller = moduleRef.get(IpExpansionStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
