import { IpDigitalDnaStageService } from './ip-digital-dna-stage.service';

describe('IpDigitalDnaStageService', () => {
  it('exports the current service class', () => {
    expect(IpDigitalDnaStageService).toBeDefined();
    expect(typeof IpDigitalDnaStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IpDigitalDnaStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IpDigitalDnaStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});