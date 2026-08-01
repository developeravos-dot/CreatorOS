import { BlueprintApplicationService } from './blueprint-application.service';

describe('BlueprintApplicationService', () => {
  it('exports the current service class', () => {
    expect(BlueprintApplicationService).toBeDefined();
    expect(typeof BlueprintApplicationService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = BlueprintApplicationService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(BlueprintApplicationService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});