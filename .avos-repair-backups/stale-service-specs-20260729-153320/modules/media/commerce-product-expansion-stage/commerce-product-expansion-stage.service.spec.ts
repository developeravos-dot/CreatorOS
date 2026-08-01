import { CommerceProductExpansionStageService } from './commerce-product-expansion-stage.service';

describe('CommerceProductExpansionStageService', () => {
  it('should expose the current service class', () => {
    expect(CommerceProductExpansionStageService).toBeDefined();
    expect(typeof CommerceProductExpansionStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CommerceProductExpansionStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CommerceProductExpansionStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CommerceProductExpansionStageService.name).toBe('CommerceProductExpansionStageService');
  });
});