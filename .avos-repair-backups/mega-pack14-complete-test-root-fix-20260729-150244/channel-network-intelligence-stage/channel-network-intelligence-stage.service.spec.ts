import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ChannelNetworkIntelligenceStageService } from './channel-network-intelligence-stage.service';

describe('ChannelNetworkIntelligenceStageService', () => {
  let service: ChannelNetworkIntelligenceStageService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ providers: [ChannelNetworkIntelligenceStageService] }).compile();
    service = module.get(ChannelNetworkIntelligenceStageService);
  });

  it('should be operational', () => {
    expect(service.getDashboard().status).toBe('operational');
    const dashboard = service.getDashboard();
    const blueprint = service.getBlueprint();

    expect(dashboard.totalStages).toBe(blueprint.stages.length);
    expect(dashboard.totalStages).toBeGreaterThan(0);
  });

  it('should create project with complete lifecycle', () => {
    const project = service.createProject({ name: 'AVOS Global Creative Project', contentType: 'cinematic-series' });
    const blueprint = service.getBlueprint();

    expect(project.stages).toHaveLength(blueprint.stages.length);
    expect(project.stages.length).toBeGreaterThan(0);
    expect(project.agents.length).toBeGreaterThan(10);
  });

  it('should enforce Human Final Authority', () => {
    const project = service.createProject({ name: 'Autonomous Project', contentType: 'video', autonomousExecutionEnabled: true });
    expect(() => service.startLifecycle(project.id)).toThrow(BadRequestException);
  });

  it('should produce brand book and production plan', () => {
    const project = service.createProject({ name: 'Brand Project', contentType: 'channel' });
    service.setBrandIdentity(project.id, { name: 'AVOS Nova', colors: ['#0B1020', '#D4AF37'] });
    expect(service.generateBrandBook(project.id).identity.name).toBe('AVOS Nova');
    expect(service.generateProductionPlan(project.id).humanFinalAuthority).toBe(true);
  });
});

