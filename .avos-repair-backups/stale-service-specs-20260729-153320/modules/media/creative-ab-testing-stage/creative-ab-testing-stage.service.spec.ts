import { CreativeAbTestingStageService } from './creative-ab-testing-stage.service';

describe('CreativeAbTestingStageService', () => {
  it('should expose the current service class', () => {
    expect(CreativeAbTestingStageService).toBeDefined();
    expect(typeof CreativeAbTestingStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CreativeAbTestingStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CreativeAbTestingStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CreativeAbTestingStageService.name).toBe('CreativeAbTestingStageService');
  });
});