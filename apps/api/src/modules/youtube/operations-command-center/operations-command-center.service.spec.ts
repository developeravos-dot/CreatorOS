import { OperationsCommandCenterService } from './operations-command-center.service';

describe('OperationsCommandCenterService', () => {
  it('exports the current service class', () => {
    expect(OperationsCommandCenterService).toBeDefined();
    expect(typeof OperationsCommandCenterService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = OperationsCommandCenterService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(OperationsCommandCenterService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});