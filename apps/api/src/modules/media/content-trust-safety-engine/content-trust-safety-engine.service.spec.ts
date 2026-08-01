import { ContentTrustSafetyEngineService } from './content-trust-safety-engine.service';

describe('ContentTrustSafetyEngineService', () => {
  it('exports the current service class', () => {
    expect(ContentTrustSafetyEngineService).toBeDefined();
    expect(typeof ContentTrustSafetyEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ContentTrustSafetyEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ContentTrustSafetyEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});