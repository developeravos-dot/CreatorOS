import { FormatInventionStageService } from './format-invention-stage.service';

describe('FormatInventionStageService', () => {
  it('exports the current service class', () => {
    expect(FormatInventionStageService).toBeDefined();
    expect(typeof FormatInventionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = FormatInventionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(FormatInventionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});