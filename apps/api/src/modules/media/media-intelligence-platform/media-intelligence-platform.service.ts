import { Injectable } from '@nestjs/common';
import { BrandIntelligenceInput, BrandIntelligenceService } from './brand-intelligence.service';
import { CreativeProductionIntelligenceService, ProductionIntelligenceInput } from './creative-production-intelligence.service';
import { MediaEcosystemInput, MediaEcosystemIntelligenceService } from './media-ecosystem-intelligence.service';

export interface CreateMediaIntelligenceProjectInput {
  brand: BrandIntelligenceInput;
  production: ProductionIntelligenceInput;
  ecosystem: MediaEcosystemInput;
}

@Injectable()
export class MediaIntelligencePlatformService {
  constructor(
    private readonly brand: BrandIntelligenceService,
    private readonly production: CreativeProductionIntelligenceService,
    private readonly ecosystem: MediaEcosystemIntelligenceService,
  ) {}

  getCapabilities() {
    return {
      system: 'AVOS Media Intelligence Platform',
      operational: true,
      capabilities: [
        'Brand Intelligence Platform',
        'Brand Identity & Creative Studio',
        'Creative Production Intelligence Engine',
        'AVOS Media Ecosystem',
        'Human Final Authority',
      ],
    };
  }

  createIntegratedProject(input: CreateMediaIntelligenceProjectInput) {
    return {
      id: `mip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      status: 'awaiting-human-approval',
      createdAt: new Date().toISOString(),
      humanFinalAuthority: { required: true, approved: false },
      brand: this.brand.createBlueprint(input.brand),
      production: this.production.createProductionPlan(input.production),
      ecosystem: this.ecosystem.createEcosystemPlan(input.ecosystem),
    };
  }
}
