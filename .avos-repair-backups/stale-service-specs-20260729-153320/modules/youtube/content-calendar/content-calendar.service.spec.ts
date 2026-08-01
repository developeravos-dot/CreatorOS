import { ContentCalendarService } from './content-calendar.service';

describe('ContentCalendarService', () => {
  it('should expose the current service class', () => {
    expect(ContentCalendarService).toBeDefined();
    expect(typeof ContentCalendarService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ContentCalendarService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ContentCalendarService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ContentCalendarService.name).toBe('ContentCalendarService');
  });
});