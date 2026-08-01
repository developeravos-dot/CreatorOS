import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  IpDigitalDnaStageController,
} from './ip-digital-dna-stage.controller';

import {
  IpDigitalDnaStageService,
} from './ip-digital-dna-stage.service';

describe('IpDigitalDnaStageController', () => {
  let controller: IpDigitalDnaStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          IpDigitalDnaStageController,
        ],
        providers: [
          IpDigitalDnaStageService,
        ],
      }).compile();

    controller =
      module.get<IpDigitalDnaStageController>(
        IpDigitalDnaStageController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(
      controller.getDashboard().status,
    ).toBe('operational');
  });

  it('should expose 24-stage blueprint', () => {
    expect(
      controller.getBlueprint().stages,
    ).toHaveLength(24);
  });
});
