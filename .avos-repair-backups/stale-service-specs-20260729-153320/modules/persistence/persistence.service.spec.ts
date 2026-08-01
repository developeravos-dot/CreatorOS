import { PersistenceService } from './persistence.service';

describe('PersistenceService', () => {
  it('should expose the current service class', () => {
    expect(PersistenceService).toBeDefined();
    expect(typeof PersistenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PersistenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PersistenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PersistenceService.name).toBe('PersistenceService');
  });
});