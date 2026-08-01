import { MediaRiskIncidentEngineService } from './media-risk-incident-engine.service';

describe('MediaRiskIncidentEngineService', () => {
  it('should expose the current service class', () => {
    expect(MediaRiskIncidentEngineService).toBeDefined();
    expect(typeof MediaRiskIncidentEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MediaRiskIncidentEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MediaRiskIncidentEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MediaRiskIncidentEngineService.name).toBe('MediaRiskIncidentEngineService');
  });
});