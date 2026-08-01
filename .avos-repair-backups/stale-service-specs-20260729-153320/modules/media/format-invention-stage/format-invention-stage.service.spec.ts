import { FormatInventionStageService } from './format-invention-stage.service';

describe('FormatInventionStageService', () => {
  it('should expose the current service class', () => {
    expect(FormatInventionStageService).toBeDefined();
    expect(typeof FormatInventionStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(FormatInventionStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (FormatInventionStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(FormatInventionStageService.name).toBe('FormatInventionStageService');
  });
});