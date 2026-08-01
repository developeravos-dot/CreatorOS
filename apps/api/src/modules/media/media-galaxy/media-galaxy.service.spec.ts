import { MediaGalaxyService } from './media-galaxy.service';
import { ExecutiveCouncilService } from './executive-council.service';
import { OrganizationOsService } from './organization-os.service';
import { KnowledgeFabricService } from './knowledge-fabric.service';
import { WorldModelService } from './world-model.service';
import { DigitalDnaService } from './digital-dna.service';
import { ContentFactoryService } from './content-factory.service';
import { RevenuePlatformService } from './revenue-platform.service';
import { GlobalExpansionService } from './global-expansion.service';
import { SecurityGovernanceService } from './security-governance.service';

describe('MediaGalaxyService', () => {
  const createService = () => new MediaGalaxyService(
    new ExecutiveCouncilService(),
    new OrganizationOsService(),
    new KnowledgeFabricService(),
    new WorldModelService(),
    new DigitalDnaService(),
    new ContentFactoryService(),
    new RevenuePlatformService(),
    new GlobalExpansionService(),
    new SecurityGovernanceService(),
  );

  it('creates a complete governed media galaxy project', () => {
    const service = createService();
    const project = service.createProject({
      name: 'Future Makers Galaxy',
      mission: 'Build original global technology media IP',
      audience: 'Arabic and global families',
      platforms: ['YouTube', 'TikTok'],
      languages: ['Arabic', 'English'],
      markets: ['UAE', 'Global'],
      revenueGoals: ['licensing', 'sponsorships'],
    });
    expect(project.status).toBe('awaiting-human-approval');
    expect(project.executiveCouncil.aiCeo).toBeDefined();
    expect(project.contentFactory.factories as string[]).toContain('Video Factory');
    expect(project.governance.humanFinalAuthority).toBe(true);
  });

  it('blocks activation until human approval', () => {
    const service = createService();
    const project = service.createProject({ name: 'AVOS Kids Galaxy', mission: 'Original stories', audience: 'children and parents', platforms: ['YouTube'] });
    expect(service.activateProject(project.id).activated).toBe(false);
    service.approveProject(project.id, 'Khalifa');
    expect(service.activateProject(project.id).activated).toBe(true);
  });

  it('creates executive decisions and persistent memory', () => {
    const service = createService();
    const project = service.createProject({ name: 'Mystery Galaxy', mission: 'Original mystery media', audience: 'young adults', platforms: ['YouTube'] });
    const decision = service.createDecision(project.id, 'Launch first pilot', { budget: 1000, market: 'UAE' });
    expect(decision.requiresHumanApproval).toBe(true);
    expect(service.getMemory(project.id).length).toBeGreaterThanOrEqual(2);
    expect(service.approveDecision(decision.id).approved).toBe(true);
  });
});
