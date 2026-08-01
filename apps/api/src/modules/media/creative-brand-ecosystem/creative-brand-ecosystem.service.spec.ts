import { BrandIntelligencePlatformService } from './brand-intelligence-platform.service';
import { CreativeBrandEcosystemService } from './creative-brand-ecosystem.service';
import { CreativeProductionIntelligenceService } from './creative-production-intelligence.service';
import { MediaEcosystemService } from './media-ecosystem.service';

describe('CreativeBrandEcosystemService', () => {
  const createService = () => new CreativeBrandEcosystemService(
    new CreativeProductionIntelligenceService(),
    new BrandIntelligencePlatformService(),
    new MediaEcosystemService(),
  );

  it('builds the five root systems in one governed project', () => {
    const service = createService();
    const project = service.create({
      name: 'Future Makers',
      contentType: 'cinematic technology stories',
      audience: 'global families',
      ageGroup: '13+',
      platform: 'YouTube',
      languages: ['Arabic', 'English'],
      cultures: ['UAE', 'Global'],
    });

    expect(project.production.productionCouncil).toContain('AI Director');
    expect(project.brand.brandBookSections).toContain('governance');
    expect(project.ecosystem.humanFinalAuthority).toBe(true);
    expect(project.status).toBe('awaiting-human-approval');
  });

  it('blocks activation until human approval', () => {
    const service = createService();
    const project = service.create({ name: 'AVOS Kids', contentType: 'children stories', audience: 'families', ageGroup: 'children', platform: 'YouTube' });
    expect(service.activate(project.id).activated).toBe(false);
    service.approve(project.id, 'Khalifa');
    expect(service.activate(project.id).activated).toBe(true);
  });

  it('learns and evolves future production and brand decisions', () => {
    const service = createService();
    const project = service.create({ name: 'Mystery World', contentType: 'documentary mystery', audience: 'young adults', ageGroup: '18+', platform: 'TikTok' });
    const learned = service.learn(project.id, 'retention', 0.84);
    expect(learned.learning).toHaveLength(1);
    expect(learned.brand.personality).toContain('category-leading');
  });
});