import { ContentCalendarService } from './content-calendar.service';

describe('ContentCalendarService', () => {
  it('exports the current service class', () => {
    expect(ContentCalendarService).toBeDefined();
    expect(typeof ContentCalendarService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ContentCalendarService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ContentCalendarService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});