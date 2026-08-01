import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  BrandIdentityEngineController,
} from './brand-identity-engine.controller';

import {
  BrandIdentityEngineService,
} from './brand-identity-engine.service';

describe('BrandIdentityEngineController', () => {
  let controller: BrandIdentityEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [BrandIdentityEngineController],
        providers: [BrandIdentityEngineService],
      }).compile();

    controller =
      module.get<BrandIdentityEngineController>(
        BrandIdentityEngineController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return operational dashboard', () => {
    expect(controller.getDashboard().status).toBe(
      'operational',
    );
  });

  it('should create a brand or IP record', () => {
    const record = controller.createRecord({
      name: 'Controller IP',
      category: 'controller',
      owner: 'CreatorOS',
    });

    expect(record.id).toBeDefined();
  });
});
