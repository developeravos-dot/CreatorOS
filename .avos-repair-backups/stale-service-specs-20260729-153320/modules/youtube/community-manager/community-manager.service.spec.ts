import { CommunityManagerService } from './community-manager.service';

describe('CommunityManagerService', () => {
  it('should expose the current service class', () => {
    expect(CommunityManagerService).toBeDefined();
    expect(typeof CommunityManagerService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CommunityManagerService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CommunityManagerService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CommunityManagerService.name).toBe('CommunityManagerService');
  });
});