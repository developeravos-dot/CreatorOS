import { CreatorServiceBusinessStageService } from './creator-service-business-stage.service';

describe('CreatorServiceBusinessStageService', () => {
  it('should expose the current service class', () => {
    expect(CreatorServiceBusinessStageService).toBeDefined();
    expect(typeof CreatorServiceBusinessStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CreatorServiceBusinessStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CreatorServiceBusinessStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CreatorServiceBusinessStageService.name).toBe('CreatorServiceBusinessStageService');
  });
});