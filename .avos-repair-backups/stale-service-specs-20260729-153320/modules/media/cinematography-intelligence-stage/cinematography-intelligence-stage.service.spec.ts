import { CinematographyIntelligenceStageService } from './cinematography-intelligence-stage.service';

describe('CinematographyIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(CinematographyIntelligenceStageService).toBeDefined();
    expect(typeof CinematographyIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CinematographyIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CinematographyIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CinematographyIntelligenceStageService.name).toBe('CinematographyIntelligenceStageService');
  });
});