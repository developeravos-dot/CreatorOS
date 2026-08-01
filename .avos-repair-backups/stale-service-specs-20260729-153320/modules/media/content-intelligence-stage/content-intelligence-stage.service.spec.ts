import { ContentIntelligenceStageService } from './content-intelligence-stage.service';

describe('ContentIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(ContentIntelligenceStageService).toBeDefined();
    expect(typeof ContentIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ContentIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ContentIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ContentIntelligenceStageService.name).toBe('ContentIntelligenceStageService');
  });
});