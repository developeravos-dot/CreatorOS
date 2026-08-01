import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  IpRightsLicensingEngineController,
} from './ip-rights-licensing-engine.controller';

import {
  IpRightsLicensingEngineService,
} from './ip-rights-licensing-engine.service';

describe('IpRightsLicensingEngineController', () => {
  let controller: IpRightsLicensingEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          IpRightsLicensingEngineController,
        ],
        providers: [
          IpRightsLicensingEngineService,
        ],
      }).compile();

    controller =
      module.get<IpRightsLicensingEngineController>(
        IpRightsLicensingEngineController,
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
