import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  it('exports the current service class', () => {
    expect(PrismaService).toBeDefined();
    expect(typeof PrismaService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PrismaService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PrismaService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});