import { ProfitReinvestmentStageService } from './profit-reinvestment-stage.service';

describe('ProfitReinvestmentStageService', () => {
  it('exports the current service class', () => {
    expect(ProfitReinvestmentStageService).toBeDefined();
    expect(typeof ProfitReinvestmentStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ProfitReinvestmentStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ProfitReinvestmentStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});