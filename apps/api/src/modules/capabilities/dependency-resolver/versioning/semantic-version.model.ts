import { DependencyResolverError } from '../errors/dependency-resolver.errors';

const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/;

export class SemanticVersionModel {
  private constructor(
    readonly major: number,
    readonly minor: number,
    readonly patch: number,
    readonly prerelease?: string,
  ) {}

  static parse(value: string): SemanticVersionModel {
    const match = SEMVER_PATTERN.exec(value.trim());

    if (!match) {
      throw new DependencyResolverError(
        `Version "${value}" is not valid semantic versioning.`,
        'DEPENDENCY_VERSION_INVALID',
        { value },
      );
    }

    return new SemanticVersionModel(
      Number(match[1]),
      Number(match[2]),
      Number(match[3]),
      match[4],
    );
  }

  compare(other: SemanticVersionModel): number {
    if (this.major !== other.major) {
      return this.major - other.major;
    }

    if (this.minor !== other.minor) {
      return this.minor - other.minor;
    }

    if (this.patch !== other.patch) {
      return this.patch - other.patch;
    }

    if (this.prerelease && !other.prerelease) {
      return -1;
    }

    if (!this.prerelease && other.prerelease) {
      return 1;
    }

    return (this.prerelease ?? '').localeCompare(
      other.prerelease ?? '',
    );
  }
}