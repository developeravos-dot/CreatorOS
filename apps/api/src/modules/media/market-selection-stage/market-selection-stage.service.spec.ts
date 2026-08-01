import { MarketSelectionStageService } from './market-selection-stage.service';

describe('MarketSelectionStageService', () => {
  it('exports the current service class', () => {
    expect(MarketSelectionStageService).toBeDefined();
    expect(typeof MarketSelectionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MarketSelectionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MarketSelectionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});