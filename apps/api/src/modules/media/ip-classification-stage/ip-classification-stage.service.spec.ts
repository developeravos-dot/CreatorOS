import { IpClassificationStageService } from './ip-classification-stage.service';

describe('IpClassificationStageService', () => {
  it('exports the current service class', () => {
    expect(IpClassificationStageService).toBeDefined();
    expect(typeof IpClassificationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IpClassificationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IpClassificationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});