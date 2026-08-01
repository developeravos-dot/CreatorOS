import { EvidenceTimestampRegistrationStageService } from './evidence-timestamp-registration-stage.service';

describe('EvidenceTimestampRegistrationStageService', () => {
  it('should expose the current service class', () => {
    expect(EvidenceTimestampRegistrationStageService).toBeDefined();
    expect(typeof EvidenceTimestampRegistrationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(EvidenceTimestampRegistrationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (EvidenceTimestampRegistrationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(EvidenceTimestampRegistrationStageService.name).toBe('EvidenceTimestampRegistrationStageService');
  });
});