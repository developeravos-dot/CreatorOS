import { ReportingEngineService } from './reporting-engine.service';

describe('ReportingEngineService', () => {
  it('exports the current service class', () => {
    expect(ReportingEngineService).toBeDefined();
    expect(typeof ReportingEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ReportingEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ReportingEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});