import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ReleaseManifest } from '../final-production.types';
import { ProductionHardeningService } from '../hardening/production-hardening.service';

@Injectable()
export class ReleaseValidationService {
  private readonly manifests = new Map<
    string,
    ReleaseManifest
  >();

  constructor(
    private readonly hardening:
      ProductionHardeningService,
  ) {}

  createManifest(input: {
    version: string;
    environment: string;
    commit: string;
    artifacts: string[];
  }) {
    const checks =
      this.hardening.listChecks();

    const approved =
      checks.length > 0 &&
      checks.every(
        (check) =>
          !check.critical ||
          check.status === 'passed',
      );

    const manifest: ReleaseManifest = {
      id: randomUUID(),
      ...input,
      checks,
      approved,
      createdAt: new Date().toISOString(),
    };

    this.manifests.set(
      manifest.id,
      manifest,
    );

    return manifest;
  }

  get(id: string) {
    const manifest =
      this.manifests.get(id);

    if (!manifest) {
      throw new Error(
        `Release manifest not found: ${id}`,
      );
    }

    return manifest;
  }

  list() {
    return [...this.manifests.values()];
  }

  summary() {
    const manifests = this.list();

    return {
      total: manifests.length,
      approved: manifests.filter(
        (item) => item.approved,
      ).length,
      blocked: manifests.filter(
        (item) => !item.approved,
      ).length,
    };
  }
}