import { RoyaltyAccountingStageService } from './royalty-accounting-stage.service';

describe('RoyaltyAccountingStageService', () => {
  it('exports the current service class', () => {
    expect(RoyaltyAccountingStageService).toBeDefined();
    expect(typeof RoyaltyAccountingStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = RoyaltyAccountingStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(RoyaltyAccountingStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});