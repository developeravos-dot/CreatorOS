import { CreativeQualityAssuranceStageService } from './creative-quality-assurance-stage.service';

describe('CreativeQualityAssuranceStageService', () => {
  it('exports the current service class', () => {
    expect(CreativeQualityAssuranceStageService).toBeDefined();
    expect(typeof CreativeQualityAssuranceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CreativeQualityAssuranceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CreativeQualityAssuranceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});