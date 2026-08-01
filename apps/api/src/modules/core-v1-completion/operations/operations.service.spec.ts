import { OperationsService } from './operations.service';

describe('OperationsService', () => {
  it('exports the current service class', () => {
    expect(OperationsService).toBeDefined();
    expect(typeof OperationsService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = OperationsService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(OperationsService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});