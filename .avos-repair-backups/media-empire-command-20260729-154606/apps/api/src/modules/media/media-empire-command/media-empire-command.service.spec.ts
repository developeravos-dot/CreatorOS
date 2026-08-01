import { MediaEmpireCommandService } from './media-empire-command.service';

describe('MediaEmpireCommandService', () => {
  it('builds one unified brand, production and ecosystem blueprint', () => {
    const service = new MediaEmpireCommandService();
    const project = service.createProject({
      name: 'Future Makers',
      contentType: 'cinematic technology documentary',
      audience: 'Arabic and global families',
      platforms: ['YouTube', 'TikTok'],
      languages: ['Arabic', 'English'],
    });

    expect(project.brand.brandBookSections).toContain('thumbnails');
    expect(project.production.council).toContain('Director Agent');
    expect(project.ecosystem.ipExpansion).toContain('licensing');
    expect(project.status).toBe('awaiting-human-approval');
  });

  it('requires human approval before activation', () => {
    const service = new MediaEmpireCommandService();
    const project = service.createProject({
      name: 'AVOS Kids',
      contentType: 'children stories',
      audience: 'children',
      platforms: ['YouTube'],
    });

    expect(service.activateProject(project.id).activated).toBe(false);
    service.approveProject(project.id, 'Khalifa');
    expect(service.activateProject(project.id).activated).toBe(true);
  });
});
