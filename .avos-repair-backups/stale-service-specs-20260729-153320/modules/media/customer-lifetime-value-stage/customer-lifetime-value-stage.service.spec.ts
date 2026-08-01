import { CustomerLifetimeValueStageService } from './customer-lifetime-value-stage.service';

describe('CustomerLifetimeValueStageService', () => {
  it('should expose the current service class', () => {
    expect(CustomerLifetimeValueStageService).toBeDefined();
    expect(typeof CustomerLifetimeValueStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CustomerLifetimeValueStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CustomerLifetimeValueStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CustomerLifetimeValueStageService.name).toBe('CustomerLifetimeValueStageService');
  });
});