import { PlatformStatusService } from './platform-status.service';

describe('PlatformStatusService', () => {
  it('should expose the current service class', () => {
    expect(PlatformStatusService).toBeDefined();
    expect(typeof PlatformStatusService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PlatformStatusService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PlatformStatusService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PlatformStatusService.name).toBe('PlatformStatusService');
  });
});