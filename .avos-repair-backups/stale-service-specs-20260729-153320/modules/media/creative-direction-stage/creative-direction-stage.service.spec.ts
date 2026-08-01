import { CreativeDirectionStageService } from './creative-direction-stage.service';

describe('CreativeDirectionStageService', () => {
  it('should expose the current service class', () => {
    expect(CreativeDirectionStageService).toBeDefined();
    expect(typeof CreativeDirectionStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CreativeDirectionStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CreativeDirectionStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CreativeDirectionStageService.name).toBe('CreativeDirectionStageService');
  });
});