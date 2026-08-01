import { CoreService } from './core.service';

describe('CoreService', () => {
  it('should expose the current service class', () => {
    expect(CoreService).toBeDefined();
    expect(typeof CoreService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CoreService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CoreService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CoreService.name).toBe('CoreService');
  });
});