import 'reflect-metadata';

import {
  DependencyVersionResolverService,
} from './dependency-version-resolver.service';

describe('DependencyVersionResolverService', () => {
  const resolver =
    new DependencyVersionResolverService();

  it('matches exact versions', () => {
    expect(
      resolver.satisfies('1.2.3', '1.2.3'),
    ).toBe(true);

    expect(
      resolver.satisfies('1.2.4', '1.2.3'),
    ).toBe(false);
  });

  it('matches caret ranges', () => {
    expect(
      resolver.satisfies('1.9.0', '^1.2.0'),
    ).toBe(true);

    expect(
      resolver.satisfies('2.0.0', '^1.2.0'),
    ).toBe(false);
  });

  it('matches tilde ranges', () => {
    expect(
      resolver.satisfies('1.2.9', '~1.2.0'),
    ).toBe(true);

    expect(
      resolver.satisfies('1.3.0', '~1.2.0'),
    ).toBe(false);
  });

  it('matches comparator ranges', () => {
    expect(
      resolver.satisfies('2.0.0', '>=1.5.0'),
    ).toBe(true);

    expect(
      resolver.satisfies('1.0.0', '>1.0.0'),
    ).toBe(false);
  });
});