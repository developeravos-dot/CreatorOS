import { IpCommercializationDistributionStageService } from './ip-commercialization-distribution-stage.service';

describe('IpCommercializationDistributionStageService', () => {
  it('exports the current service class', () => {
    expect(IpCommercializationDistributionStageService).toBeDefined();
    expect(typeof IpCommercializationDistributionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IpCommercializationDistributionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IpCommercializationDistributionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});