import { Injectable } from '@nestjs/common';

import { SemanticVersionModel } from './semantic-version.model';

@Injectable()
export class DependencyVersionResolverService {
  satisfies(
    versionValue: string,
    rangeValue: string,
  ): boolean {
    const version =
      SemanticVersionModel.parse(versionValue);

    const range = rangeValue.trim();

    if (
      range === '' ||
      range === '*' ||
      range.toLowerCase() === 'latest'
    ) {
      return true;
    }

    if (range.startsWith('^')) {
      const base = SemanticVersionModel.parse(
        range.slice(1),
      );

      if (version.compare(base) < 0) {
        return false;
      }

      if (base.major > 0) {
        return version.major === base.major;
      }

      if (base.minor > 0) {
        return (
          version.major === 0 &&
          version.minor === base.minor
        );
      }

      return (
        version.major === 0 &&
        version.minor === 0 &&
        version.patch === base.patch
      );
    }

    if (range.startsWith('~')) {
      const base = SemanticVersionModel.parse(
        range.slice(1),
      );

      return (
        version.compare(base) >= 0 &&
        version.major === base.major &&
        version.minor === base.minor
      );
    }

    if (range.startsWith('>=')) {
      const base = SemanticVersionModel.parse(
        range.slice(2),
      );

      return version.compare(base) >= 0;
    }

    if (range.startsWith('<=')) {
      const base = SemanticVersionModel.parse(
        range.slice(2),
      );

      return version.compare(base) <= 0;
    }

    if (range.startsWith('>')) {
      const base = SemanticVersionModel.parse(
        range.slice(1),
      );

      return version.compare(base) > 0;
    }

    if (range.startsWith('<')) {
      const base = SemanticVersionModel.parse(
        range.slice(1),
      );

      return version.compare(base) < 0;
    }

    return (
      version.compare(
        SemanticVersionModel.parse(range),
      ) === 0
    );
  }
}