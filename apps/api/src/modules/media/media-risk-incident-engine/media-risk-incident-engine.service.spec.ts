import { MediaRiskIncidentEngineService } from './media-risk-incident-engine.service';

describe('MediaRiskIncidentEngineService', () => {
  it('exports the current service class', () => {
    expect(MediaRiskIncidentEngineService).toBeDefined();
    expect(typeof MediaRiskIncidentEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MediaRiskIncidentEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MediaRiskIncidentEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});