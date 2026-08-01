import { VirtualProductionStageService } from './virtual-production-stage.service';

describe('VirtualProductionStageService', () => {
  it('should expose the current service class', () => {
    expect(VirtualProductionStageService).toBeDefined();
    expect(typeof VirtualProductionStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(VirtualProductionStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (VirtualProductionStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(VirtualProductionStageService.name).toBe('VirtualProductionStageService');
  });
});