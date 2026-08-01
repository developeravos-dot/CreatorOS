import { IpDigitalDnaEngineService } from './ip-digital-dna-engine.service';

describe('IpDigitalDnaEngineService', () => {
  it('exports the current service class', () => {
    expect(IpDigitalDnaEngineService).toBeDefined();
    expect(typeof IpDigitalDnaEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IpDigitalDnaEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IpDigitalDnaEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});