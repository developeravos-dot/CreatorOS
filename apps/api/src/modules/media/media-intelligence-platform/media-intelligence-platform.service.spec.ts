import { BrandIntelligenceService } from './brand-intelligence.service';
import { CreativeProductionIntelligenceService } from './creative-production-intelligence.service';
import { MediaEcosystemIntelligenceService } from './media-ecosystem-intelligence.service';
import { MediaIntelligencePlatformService } from './media-intelligence-platform.service';

describe('MediaIntelligencePlatformService', () => {
  const service = new MediaIntelligencePlatformService(
    new BrandIntelligenceService(),
    new CreativeProductionIntelligenceService(),
    new MediaEcosystemIntelligenceService(),
  );

  it('reports all core media intelligence capabilities', () => {
    expect(service.getCapabilities().capabilities).toContain('Brand Intelligence Platform');
    expect(service.getCapabilities().capabilities).toContain('Creative Production Intelligence Engine');
    expect(service.getCapabilities().capabilities).toContain('AVOS Media Ecosystem');
  });

  it('creates an integrated project guarded by human final authority', () => {
    const project = service.createIntegratedProject({
      brand: { name: 'Future Makers', audience: 'global families', category: 'technology media' },
      production: { title: 'Tomorrow Invented', contentType: 'cinematic documentary', platforms: ['YouTube', 'TikTok'] },
      ecosystem: { projectName: 'Future Makers', platforms: ['YouTube', 'TikTok'] },
    });
    expect(project.status).toBe('awaiting-human-approval');
    expect(project.humanFinalAuthority.required).toBe(true);
    expect(project.brand.system).toBe('AVOS Brand Intelligence Platform');
    expect(project.production.system).toBe('Creative Production Intelligence Engine');
    expect(project.ecosystem.system).toBe('AVOS Media Ecosystem');
  });
});
