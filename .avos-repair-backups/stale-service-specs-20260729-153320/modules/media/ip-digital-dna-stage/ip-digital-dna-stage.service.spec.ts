import { IpDigitalDnaStageService } from './ip-digital-dna-stage.service';

describe('IpDigitalDnaStageService', () => {
  it('should expose the current service class', () => {
    expect(IpDigitalDnaStageService).toBeDefined();
    expect(typeof IpDigitalDnaStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IpDigitalDnaStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IpDigitalDnaStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IpDigitalDnaStageService.name).toBe('IpDigitalDnaStageService');
  });
});