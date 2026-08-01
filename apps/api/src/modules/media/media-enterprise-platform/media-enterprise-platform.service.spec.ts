import { BrandOperatingSystemService } from './brand-operating-system.service';
import { IpRevenueService } from './ip-revenue.service';
import { MediaEnterprisePlatformService } from './media-enterprise-platform.service';
import { MediaEventBusService } from './media-event-bus.service';
import { ProductionOperatingSystemService } from './production-operating-system.service';
import { PublishingGrowthService } from './publishing-growth.service';

describe('MediaEnterprisePlatformService', () => {
  const createService = () => {
    const events = new MediaEventBusService();
    return {
      events,
      service: new MediaEnterprisePlatformService(
        events,
        new BrandOperatingSystemService(),
        new ProductionOperatingSystemService(),
        new PublishingGrowthService(),
        new IpRevenueService(),
      ),
    };
  };

  it('creates a complete enterprise media project', () => {
    const { service } = createService();
    const project = service.createProject({
      name: 'Future Makers',
      brandName: 'Future Makers',
      contentType: 'cinematic technology documentary',
      audience: 'Arabic and global families',
      platforms: ['YouTube', 'TikTok'],
      languages: ['Arabic', 'English'],
      markets: ['UAE', 'GCC', 'Global'],
      budget: 10000,
    });

    expect(project.status).toBe('awaiting-human-approval');
    expect(project.brand.system).toBe('AVOS Brand Operating System');
    expect(project.production.system).toBe('Creative Production Operating System');
    expect(project.publishing.network).toContain('YouTube');
    expect(project.intellectualProperty.registry).toContain('format');
    expect(project.revenue.streams).toContain('licensing');
  });

  it('enforces approval and production completion before publishing', () => {
    const { service } = createService();
    const project = service.createProject({
      name: 'AVOS Kids',
      brandName: 'AVOS Kids',
      contentType: 'original children stories',
      audience: 'children and parents',
      platforms: ['YouTube'],
    });

    expect(service.startProduction(project.id).started).toBe(false);
    service.approveProject(project.id, 'Khalifa');
    expect(service.startProduction(project.id).started).toBe(true);
    expect(service.publishProject(project.id).published).toBe(false);
    service.updateProgress(project.id, 100);
    expect(service.publishProject(project.id).published).toBe(true);
    expect(service.getAuditTrail(project.id).length).toBeGreaterThanOrEqual(5);
  });

  it('reports dashboard totals and status counts', () => {
    const { service } = createService();
    service.createProject({
      name: 'Mystery Lab',
      brandName: 'Mystery Lab',
      contentType: 'mystery documentary',
      audience: 'young adults',
      platforms: ['YouTube'],
    });
    const dashboard = service.getDashboard();
    expect(dashboard.projects).toBe(1);
    expect(dashboard.awaitingHumanApproval).toBe(1);
    expect(dashboard.capabilities).toContain('Revenue Engine');
  });
});
