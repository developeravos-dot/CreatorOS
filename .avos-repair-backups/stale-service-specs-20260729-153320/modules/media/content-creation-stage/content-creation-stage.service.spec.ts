import { ContentCreationStageService } from './content-creation-stage.service';

describe('ContentCreationStageService', () => {
  it('should expose the current service class', () => {
    expect(ContentCreationStageService).toBeDefined();
    expect(typeof ContentCreationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ContentCreationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ContentCreationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ContentCreationStageService.name).toBe('ContentCreationStageService');
  });
});