import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  IpDigitalDnaEngineController,
} from './ip-digital-dna-engine.controller';

import {
  IpDigitalDnaEngineService,
} from './ip-digital-dna-engine.service';

describe('IpDigitalDnaEngineController', () => {
  let controller: IpDigitalDnaEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          IpDigitalDnaEngineController,
        ],
        providers: [
          IpDigitalDnaEngineService,
        ],
      }).compile();

    controller =
      module.get<IpDigitalDnaEngineController>(
        IpDigitalDnaEngineController,
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
});
