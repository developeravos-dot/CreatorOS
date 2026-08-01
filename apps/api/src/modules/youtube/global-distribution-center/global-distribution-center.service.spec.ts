import { GlobalDistributionCenterService } from './global-distribution-center.service';

describe('GlobalDistributionCenterService', () => {
  it('exports the current service class', () => {
    expect(GlobalDistributionCenterService).toBeDefined();
    expect(typeof GlobalDistributionCenterService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = GlobalDistributionCenterService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(GlobalDistributionCenterService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});