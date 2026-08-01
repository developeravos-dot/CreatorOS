import { AutonomousMediaOperationsService } from './autonomous-media-operations.service';
import { MediaExperimentService } from './media-experiment.service';
import { MediaMemoryService } from './media-memory.service';

describe('AutonomousMediaOperationsService', () => {
  const create = () => {
    const memory = new MediaMemoryService();
    const experiments = new MediaExperimentService();
    return {
      memory,
      experiments,
      service: new AutonomousMediaOperationsService(memory, experiments),
    };
  };

  it('creates a complete autonomous media project', () => {
    const { service } = create();
    const project = service.createProject({
      name: 'Future Makers Autonomous Network',
      brandName: 'Future Makers',
      contentType: 'cinematic technology documentary',
      audience: 'Arabic and global families',
      platforms: ['YouTube', 'TikTok'],
      languages: ['Arabic', 'English'],
      markets: ['UAE', 'GCC', 'Global'],
      publishingCadence: 'weekly',
    });

    expect(project.status).toBe('awaiting-human-approval');
    expect(project.operations.autonomousAgents).toContain('Opportunity Agent');
    expect(project.localization.languages).toContain('Arabic');
    expect(project.licensing.assets).toContain('formats');
  });

  it('requires human approval before scheduling or running', () => {
    const { service } = create();
    const project = service.createProject({
      name: 'AVOS Kids Autonomous',
      brandName: 'AVOS Kids',
      contentType: 'original children stories',
      audience: 'children and parents',
      platforms: ['YouTube'],
    });

    expect(service.scheduleProject(project.id).scheduled).toBe(false);
    expect(service.runCycle(project.id).executed).toBe(false);

    service.approveProject(project.id, 'Khalifa');
    expect(service.scheduleProject(project.id).scheduled).toBe(true);
    expect(service.runCycle(project.id).executed).toBe(true);
  });

  it('records memory and completes experiments', () => {
    const { service, experiments } = create();
    const project = service.createProject({
      name: 'Mystery Lab',
      brandName: 'Mystery Lab',
      contentType: 'original mystery documentary',
      audience: 'young adults',
      platforms: ['YouTube'],
    });
    service.approveProject(project.id, 'Khalifa');
    const experiment = service.createExperiment(
      project.id,
      'A curiosity-led title improves completion',
      ['Curiosity title', 'Direct title'],
      'completionRate',
    );
    experiments.start(experiment.id);
    experiments.complete(experiment.id, 'Curiosity title');

    expect(experiments.get(experiment.id).status).toBe('completed');
    expect(service.getProjectMemory(project.id).length).toBeGreaterThanOrEqual(3);
  });

  it('reports unified autonomous dashboard metrics', () => {
    const { service } = create();
    service.createProject({
      name: 'History Rebuilt',
      brandName: 'History Rebuilt',
      contentType: 'AI recreated historical events',
      audience: 'global learners',
      platforms: ['YouTube'],
    });

    const dashboard = service.getDashboard();
    expect(dashboard.projects).toBe(1);
    expect(dashboard.awaitingHumanApproval).toBe(1);
    expect(dashboard.capabilities).toContain('Persistent Media Memory');
  });
});
