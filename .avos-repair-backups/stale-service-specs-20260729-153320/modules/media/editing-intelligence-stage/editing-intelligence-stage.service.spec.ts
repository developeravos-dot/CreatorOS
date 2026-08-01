import { EditingIntelligenceStageService } from './editing-intelligence-stage.service';

describe('EditingIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(EditingIntelligenceStageService).toBeDefined();
    expect(typeof EditingIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(EditingIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (EditingIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(EditingIntelligenceStageService.name).toBe('EditingIntelligenceStageService');
  });
});