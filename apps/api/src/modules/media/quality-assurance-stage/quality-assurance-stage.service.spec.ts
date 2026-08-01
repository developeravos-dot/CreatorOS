import { QualityAssuranceStageService } from './quality-assurance-stage.service';

describe('QualityAssuranceStageService', () => {
  it('exports the current service class', () => {
    expect(QualityAssuranceStageService).toBeDefined();
    expect(typeof QualityAssuranceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = QualityAssuranceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(QualityAssuranceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});