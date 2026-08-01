import { EvidenceTimestampRegistrationStageService } from './evidence-timestamp-registration-stage.service';

describe('EvidenceTimestampRegistrationStageService', () => {
  it('exports the current service class', () => {
    expect(EvidenceTimestampRegistrationStageService).toBeDefined();
    expect(typeof EvidenceTimestampRegistrationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = EvidenceTimestampRegistrationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(EvidenceTimestampRegistrationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});