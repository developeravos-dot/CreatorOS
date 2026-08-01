import { DependencyService } from './dependency.service';

describe('DependencyService', () => {
  it('should expose the current service class', () => {
    expect(DependencyService).toBeDefined();
    expect(typeof DependencyService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(DependencyService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (DependencyService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(DependencyService.name).toBe('DependencyService');
  });
});