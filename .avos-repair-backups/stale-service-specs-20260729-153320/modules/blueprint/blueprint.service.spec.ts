import { BlueprintService } from './blueprint.service';

describe('BlueprintService', () => {
  it('should expose the current service class', () => {
    expect(BlueprintService).toBeDefined();
    expect(typeof BlueprintService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(BlueprintService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (BlueprintService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(BlueprintService.name).toBe('BlueprintService');
  });
});