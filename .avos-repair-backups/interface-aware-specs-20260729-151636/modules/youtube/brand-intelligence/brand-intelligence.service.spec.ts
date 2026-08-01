import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { BrandIntelligenceService } from './brand-intelligence.service';

describe('BrandIntelligenceService', () => {
  let service: BrandIntelligenceService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [BrandIntelligenceService],
      }).compile();

    service =
      module.get<BrandIntelligenceService>(
        BrandIntelligenceService,
      );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and list a brand', () => {
    const brand = service.createBrand({
      name: 'CreatorOS',
      tone: 'professional',
    });

    expect(brand.id).toBeDefined();
    expect(service.listBrands()).toHaveLength(1);
  });

  it('should reject an empty brand name', () => {
    expect(() =>
      service.createBrand({
        name: '   ',
      }),
    ).toThrow(BadRequestException);
  });

  it('should add a brand asset', () => {
    const brand = service.createBrand({
      name: 'CreatorOS',
    });

    const asset = service.addAsset(brand.id, {
      type: 'logo',
      name: 'Primary Logo',
      value: 'creatoros-logo.svg',
      isPrimary: true,
    });

    expect(asset.isPrimary).toBe(true);
    expect(service.getBrand(brand.id).assets).toHaveLength(1);
  });

  it('should analyze compliant content', () => {
    const brand = service.createBrand({
      name: 'CreatorOS',
      keywords: ['innovation', 'creator'],
      prohibitedTerms: ['cheap'],
    });

    const result = service.analyzeContent(
      brand.id,
      'Creator innovation platform',
    );

    expect(result.score).toBe(100);
    expect(result.compliant).toBe(true);
  });

  it('should detect prohibited terms', () => {
    const brand = service.createBrand({
      name: 'CreatorOS',
      prohibitedTerms: ['cheap'],
    });

    const result = service.analyzeContent(
      brand.id,
      'This is a cheap product',
    );

    expect(result.prohibitedMatches).toContain('cheap');
    expect(result.compliant).toBe(false);
  });

  it('should calculate dashboard totals', () => {
    service.createBrand({
      name: 'Brand One',
      status: 'active',
      tone: 'luxury',
    });

    service.createBrand({
      name: 'Brand Two',
      status: 'draft',
      tone: 'professional',
    });

    const dashboard = service.getDashboard();

    expect(dashboard.totalBrands).toBe(2);
    expect(dashboard.activeBrands).toBe(1);
    expect(dashboard.totalsByTone.luxury).toBe(1);
  });
});
