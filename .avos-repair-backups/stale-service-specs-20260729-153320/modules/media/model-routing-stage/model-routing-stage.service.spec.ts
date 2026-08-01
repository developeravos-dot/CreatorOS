import { ModelRoutingStageService } from './model-routing-stage.service';

describe('ModelRoutingStageService', () => {
  it('should expose the current service class', () => {
    expect(ModelRoutingStageService).toBeDefined();
    expect(typeof ModelRoutingStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ModelRoutingStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ModelRoutingStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ModelRoutingStageService.name).toBe('ModelRoutingStageService');
  });
});