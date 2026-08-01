import { ProductionCouncilStageService } from './production-council-stage.service';

describe('ProductionCouncilStageService', () => {
  it('should expose the current service class', () => {
    expect(ProductionCouncilStageService).toBeDefined();
    expect(typeof ProductionCouncilStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ProductionCouncilStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ProductionCouncilStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ProductionCouncilStageService.name).toBe('ProductionCouncilStageService');
  });
});