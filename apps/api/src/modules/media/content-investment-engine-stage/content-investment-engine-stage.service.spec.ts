import { ContentInvestmentEngineStageService } from './content-investment-engine-stage.service';

describe('ContentInvestmentEngineStageService', () => {
  it('exports the current service class', () => {
    expect(ContentInvestmentEngineStageService).toBeDefined();
    expect(typeof ContentInvestmentEngineStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ContentInvestmentEngineStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ContentInvestmentEngineStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});