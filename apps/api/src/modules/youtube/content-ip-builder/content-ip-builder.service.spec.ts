import { ContentIpBuilderService } from './content-ip-builder.service';

describe('ContentIpBuilderService', () => {
  it('exports the current service class', () => {
    expect(ContentIpBuilderService).toBeDefined();
    expect(typeof ContentIpBuilderService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ContentIpBuilderService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ContentIpBuilderService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});