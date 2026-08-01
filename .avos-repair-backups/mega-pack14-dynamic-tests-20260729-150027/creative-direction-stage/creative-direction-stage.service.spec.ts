import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreativeDirectionStageService } from './creative-direction-stage.service';

describe('CreativeDirectionStageService', () => {
  let service: CreativeDirectionStageService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ providers: [CreativeDirectionStageService] }).compile();
    service = module.get(CreativeDirectionStageService);
  });

  it('should be operational', () => {
    expect(service.getDashboard().status).toBe('operational');
    expect(service.getDashboard().totalStages).toBe(40);
  });

  it('should create project with complete lifecycle', () => {
    const project = service.createProject({ name: 'AVOS Global Creative Project', contentType: 'cinematic-series' });
    expect(project.stages).toHaveLength(40);
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
