import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  it('should expose the current service class', () => {
    expect(PrismaService).toBeDefined();
    expect(typeof PrismaService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PrismaService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PrismaService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PrismaService.name).toBe('PrismaService');
  });
});