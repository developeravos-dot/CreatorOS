import { QualityAssuranceStageService } from './quality-assurance-stage.service';

describe('QualityAssuranceStageService', () => {
  it('should expose the current service class', () => {
    expect(QualityAssuranceStageService).toBeDefined();
    expect(typeof QualityAssuranceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(QualityAssuranceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (QualityAssuranceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(QualityAssuranceStageService.name).toBe('QualityAssuranceStageService');
  });
});