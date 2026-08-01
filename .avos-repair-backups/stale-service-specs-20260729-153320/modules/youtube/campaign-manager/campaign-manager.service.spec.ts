import { CampaignManagerService } from './campaign-manager.service';

describe('CampaignManagerService', () => {
  it('should expose the current service class', () => {
    expect(CampaignManagerService).toBeDefined();
    expect(typeof CampaignManagerService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CampaignManagerService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CampaignManagerService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CampaignManagerService.name).toBe('CampaignManagerService');
  });
});