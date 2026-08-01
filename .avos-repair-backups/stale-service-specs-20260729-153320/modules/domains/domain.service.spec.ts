import { DomainService } from './domain.service';

describe('DomainService', () => {
  it('should expose the current service class', () => {
    expect(DomainService).toBeDefined();
    expect(typeof DomainService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(DomainService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (DomainService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(DomainService.name).toBe('DomainService');
  });
});