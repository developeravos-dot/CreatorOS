import { CreativeQualityAssuranceStageService } from './creative-quality-assurance-stage.service';

describe('CreativeQualityAssuranceStageService', () => {
  it('should expose the current service class', () => {
    expect(CreativeQualityAssuranceStageService).toBeDefined();
    expect(typeof CreativeQualityAssuranceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CreativeQualityAssuranceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CreativeQualityAssuranceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CreativeQualityAssuranceStageService.name).toBe('CreativeQualityAssuranceStageService');
  });
});