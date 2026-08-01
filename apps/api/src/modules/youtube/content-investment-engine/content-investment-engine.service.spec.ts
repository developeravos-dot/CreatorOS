import { ContentInvestmentEngineService } from './content-investment-engine.service';

describe('ContentInvestmentEngineService', () => {
  it('exports the current service class', () => {
    expect(ContentInvestmentEngineService).toBeDefined();
    expect(typeof ContentInvestmentEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ContentInvestmentEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ContentInvestmentEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});