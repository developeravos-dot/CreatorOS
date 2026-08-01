import { VisualDnaStageService } from './visual-dna-stage.service';

describe('VisualDnaStageService', () => {
  it('exports the current service class', () => {
    expect(VisualDnaStageService).toBeDefined();
    expect(typeof VisualDnaStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = VisualDnaStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(VisualDnaStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});