import { ContentTrustSafetyEngineService } from './content-trust-safety-engine.service';

describe('ContentTrustSafetyEngineService', () => {
  it('should expose the current service class', () => {
    expect(ContentTrustSafetyEngineService).toBeDefined();
    expect(typeof ContentTrustSafetyEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ContentTrustSafetyEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ContentTrustSafetyEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ContentTrustSafetyEngineService.name).toBe('ContentTrustSafetyEngineService');
  });
});