import { AudienceAnalyzerService } from './audience-analyzer.service';

describe('AudienceAnalyzerService', () => {
  it('exports the current service class', () => {
    expect(AudienceAnalyzerService).toBeDefined();
    expect(typeof AudienceAnalyzerService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AudienceAnalyzerService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AudienceAnalyzerService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});