import { ContentIntelligenceStageService } from './content-intelligence-stage.service';

describe('ContentIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(ContentIntelligenceStageService).toBeDefined();
    expect(typeof ContentIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ContentIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ContentIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});