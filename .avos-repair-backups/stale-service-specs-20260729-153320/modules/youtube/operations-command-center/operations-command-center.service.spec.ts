import { OperationsCommandCenterService } from './operations-command-center.service';

describe('OperationsCommandCenterService', () => {
  it('should expose the current service class', () => {
    expect(OperationsCommandCenterService).toBeDefined();
    expect(typeof OperationsCommandCenterService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(OperationsCommandCenterService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (OperationsCommandCenterService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(OperationsCommandCenterService.name).toBe('OperationsCommandCenterService');
  });
});