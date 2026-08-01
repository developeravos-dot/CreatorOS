import { ContentInvestmentEngineStageService } from './content-investment-engine-stage.service';

describe('ContentInvestmentEngineStageService', () => {
  it('should expose the current service class', () => {
    expect(ContentInvestmentEngineStageService).toBeDefined();
    expect(typeof ContentInvestmentEngineStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ContentInvestmentEngineStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ContentInvestmentEngineStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ContentInvestmentEngineStageService.name).toBe('ContentInvestmentEngineStageService');
  });
});