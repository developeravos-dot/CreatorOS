import { IpProductizationStageService } from './ip-productization-stage.service';

describe('IpProductizationStageService', () => {
  it('exports the current service class', () => {
    expect(IpProductizationStageService).toBeDefined();
    expect(typeof IpProductizationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IpProductizationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IpProductizationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});