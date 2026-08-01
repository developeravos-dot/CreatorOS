import { IpExpansionStageService } from './ip-expansion-stage.service';

describe('IpExpansionStageService', () => {
  it('exports the current service class', () => {
    expect(IpExpansionStageService).toBeDefined();
    expect(typeof IpExpansionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IpExpansionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IpExpansionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});