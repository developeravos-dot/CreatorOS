import {
  Injectable,
} from '@nestjs/common';

import type {
  EnterpriseReleaseManifest,
  EnterpriseReleaseValidation,
} from '../contracts';

@Injectable()
export class EnterpriseReleaseManagerService {
  private readonly releases =
    new Map<
      string,
      EnterpriseReleaseManifest
    >();

  create(input: {
    readonly releaseId: string;
    readonly version: string;
    readonly environment:
      | 'staging'
      | 'production';
    readonly image: string;
    readonly replicas: number;
    readonly now?: Date;
  }): EnterpriseReleaseManifest {
    const releaseId =
      input.releaseId.trim();

    const version =
      input.version.trim();

    const image =
      input.image.trim();

    if (
      !releaseId ||
      !version ||
      !image ||
      !Number.isInteger(
        input.replicas,
      ) ||
      input.replicas < 2 ||
      this.releases.has(releaseId)
    ) {
      throw new Error(
        'Valid unique highly available release manifest is required.',
      );
    }

    const release:
      EnterpriseReleaseManifest = {
        releaseId,
        version,
        environment:
          input.environment,
        image,
        replicas:
          input.replicas,
        createdAt: new Date(
          input.now ?? new Date(),
        ),
      };

    this.releases.set(
      releaseId,
      release,
    );

    return this.clone(release);
  }

  validate(
    release:
      EnterpriseReleaseManifest,
  ): EnterpriseReleaseValidation {
    const blockers: string[] = [];
    const warnings: string[] = [];

    if (
      release.environment ===
        'production' &&
      release.replicas < 3
    ) {
      blockers.push(
        'Production releases require at least three replicas.',
      );
    }

    if (
      !release.image.includes(':')
    ) {
      blockers.push(
        'Container image must use an explicit tag.',
      );
    }

    if (
      release.version.startsWith(
        '0.',
      )
    ) {
      warnings.push(
        'Pre-1.0 version detected.',
      );
    }

    return {
      valid:
        blockers.length === 0,
      blockers,
      warnings,
      checkedAt: new Date(),
    };
  }

  list():
    readonly EnterpriseReleaseManifest[] {
    return [...this.releases.values()]
      .sort(
        (left, right) =>
          right.createdAt.getTime() -
          left.createdAt.getTime(),
      )
      .map((release) =>
        this.clone(release),
      );
  }

  private clone(
    release:
      EnterpriseReleaseManifest,
  ): EnterpriseReleaseManifest {
    return {
      ...release,
      createdAt: new Date(
        release.createdAt,
      ),
    };
  }
}
