import { ContentAnalyzerService } from './content-analyzer.service';

describe('ContentAnalyzerService', () => {
  it('exports the current service class', () => {
    expect(ContentAnalyzerService).toBeDefined();
    expect(typeof ContentAnalyzerService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ContentAnalyzerService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ContentAnalyzerService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});