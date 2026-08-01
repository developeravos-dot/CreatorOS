import { CreativeProductionService } from './creative-production.service';

describe('CreativeProductionService', () => {
  it('should expose the current service class', () => {
    expect(CreativeProductionService).toBeDefined();
    expect(typeof CreativeProductionService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CreativeProductionService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CreativeProductionService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CreativeProductionService.name).toBe('CreativeProductionService');
  });
});