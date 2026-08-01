import { VisualDnaStageService } from './visual-dna-stage.service';

describe('VisualDnaStageService', () => {
  it('should expose the current service class', () => {
    expect(VisualDnaStageService).toBeDefined();
    expect(typeof VisualDnaStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(VisualDnaStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (VisualDnaStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(VisualDnaStageService.name).toBe('VisualDnaStageService');
  });
});