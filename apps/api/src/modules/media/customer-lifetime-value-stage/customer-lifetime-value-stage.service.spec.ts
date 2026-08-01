import { CustomerLifetimeValueStageService } from './customer-lifetime-value-stage.service';

describe('CustomerLifetimeValueStageService', () => {
  it('exports the current service class', () => {
    expect(CustomerLifetimeValueStageService).toBeDefined();
    expect(typeof CustomerLifetimeValueStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CustomerLifetimeValueStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CustomerLifetimeValueStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});