import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  AffiliateCommerceController,
} from './affiliate-commerce.controller';

import {
  AffiliateCommerceService,
} from './affiliate-commerce.service';

describe('AffiliateCommerceController', () => {
  let controller: AffiliateCommerceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [AffiliateCommerceController],
        providers: [AffiliateCommerceService],
      }).compile();

    controller =
      module.get<AffiliateCommerceController>(
        AffiliateCommerceController,
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

  it('should create a monetization record', () => {
    const record = controller.createRecord({
      title: 'Controller Revenue',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
