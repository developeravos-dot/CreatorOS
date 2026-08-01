import { RuntimeService } from './runtime.service';

describe('RuntimeService', () => {
  it('should expose the current service class', () => {
    expect(RuntimeService).toBeDefined();
    expect(typeof RuntimeService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(RuntimeService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (RuntimeService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(RuntimeService.name).toBe('RuntimeService');
  });
});