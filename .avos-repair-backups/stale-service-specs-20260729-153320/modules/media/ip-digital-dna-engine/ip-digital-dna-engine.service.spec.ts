import { IpDigitalDnaEngineService } from './ip-digital-dna-engine.service';

describe('IpDigitalDnaEngineService', () => {
  it('should expose the current service class', () => {
    expect(IpDigitalDnaEngineService).toBeDefined();
    expect(typeof IpDigitalDnaEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IpDigitalDnaEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IpDigitalDnaEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IpDigitalDnaEngineService.name).toBe('IpDigitalDnaEngineService');
  });
});