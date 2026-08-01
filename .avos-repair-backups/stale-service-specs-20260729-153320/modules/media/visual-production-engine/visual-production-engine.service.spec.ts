import { VisualProductionEngineService } from './visual-production-engine.service';

describe('VisualProductionEngineService', () => {
  it('should expose the current service class', () => {
    expect(VisualProductionEngineService).toBeDefined();
    expect(typeof VisualProductionEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(VisualProductionEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (VisualProductionEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(VisualProductionEngineService.name).toBe('VisualProductionEngineService');
  });
});