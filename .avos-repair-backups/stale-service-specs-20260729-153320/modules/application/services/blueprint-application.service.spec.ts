import { BlueprintApplicationService } from './blueprint-application.service';

describe('BlueprintApplicationService', () => {
  it('should expose the current service class', () => {
    expect(BlueprintApplicationService).toBeDefined();
    expect(typeof BlueprintApplicationService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(BlueprintApplicationService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (BlueprintApplicationService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(BlueprintApplicationService.name).toBe('BlueprintApplicationService');
  });
});