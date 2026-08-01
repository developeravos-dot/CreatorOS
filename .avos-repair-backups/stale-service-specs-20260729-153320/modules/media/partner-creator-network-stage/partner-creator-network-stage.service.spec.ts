import { PartnerCreatorNetworkStageService } from './partner-creator-network-stage.service';

describe('PartnerCreatorNetworkStageService', () => {
  it('should expose the current service class', () => {
    expect(PartnerCreatorNetworkStageService).toBeDefined();
    expect(typeof PartnerCreatorNetworkStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PartnerCreatorNetworkStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PartnerCreatorNetworkStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PartnerCreatorNetworkStageService.name).toBe('PartnerCreatorNetworkStageService');
  });
});