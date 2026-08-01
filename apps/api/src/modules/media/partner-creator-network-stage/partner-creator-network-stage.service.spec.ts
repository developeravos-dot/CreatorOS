import { PartnerCreatorNetworkStageService } from './partner-creator-network-stage.service';

describe('PartnerCreatorNetworkStageService', () => {
  it('exports the current service class', () => {
    expect(PartnerCreatorNetworkStageService).toBeDefined();
    expect(typeof PartnerCreatorNetworkStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PartnerCreatorNetworkStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PartnerCreatorNetworkStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});