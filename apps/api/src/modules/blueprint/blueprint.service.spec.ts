import { BlueprintService } from './blueprint.service';

describe('BlueprintService', () => {
  it('exports the current service class', () => {
    expect(BlueprintService).toBeDefined();
    expect(typeof BlueprintService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = BlueprintService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(BlueprintService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});