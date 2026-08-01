import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import { PermanentUniverseMemoryService } from '../persistent-memory/permanent-universe-memory.service';
import { ProviderCompatibilityService } from '../provider-compatibility-layer/provider-compatibility.service';

import { ReviewProviderMigrationDto } from './dto/review-provider-migration.dto';
import { RunProviderMigrationTestDto } from './dto/run-provider-migration-test.dto';

import type {
  ProviderEntityLock,
  ProviderMigrationTest,
} from './models/provider-migration.models';

@Injectable()
export class ProviderMigrationGateService {
  constructor(
    private readonly memory:
      PermanentUniverseMemoryService,

    private readonly compatibility:
      ProviderCompatibilityService,
  ) {}

  async runTest(
    dto: RunProviderMigrationTestDto,
  ) {
    const fingerprints =
      await this.memory
        .loadCanonicalFingerprints(
          dto.worldId,
        );

    const fingerprint =
      fingerprints.find(
        (item) =>
          item.bibleId === dto.bibleId &&
          item.entityType === dto.entityType &&
          item.entityId === dto.entityId,
      );

    if (!fingerprint) {
      throw new NotFoundException(
        `Canonical fingerprint not found: ${dto.entityType}:${dto.entityId}.`,
      );
    }

    const resolution =
      await this.compatibility.resolve({
        workload: dto.workload,
        requestedProviderId:
          dto.candidateProviderId,

        worldId:
          dto.worldId,

        entityId:
          dto.entityId,
      });

    if (
      !resolution.decision.allowed
    ) {
      throw new BadRequestException(
        `Candidate provider is not allowed: ${dto.candidateProviderId}.`,
      );
    }

    const scores = {
      identity:
        dto.identityScore,

      colors:
        dto.colorScore,

      proportions:
        dto.proportionScore,

      signatureElements:
        dto.signatureElementScore,

      style:
        dto.styleScore,

      continuity:
        dto.continuityScore,

      total:
        this.totalScore(dto),
    };

    const thresholds = {
      minimumIdentity: 95,
      minimumColors: 95,
      minimumProportions: 95,
      minimumSignatureElements: 95,
      minimumStyle: 92,
      minimumContinuity: 97,
      minimumTotal: 97,
    };

    const failures: string[] = [];
    const warnings: string[] = [];

    if (
      scores.identity <
      thresholds.minimumIdentity
    ) {
      failures.push(
        `Identity score ${scores.identity} is below ${thresholds.minimumIdentity}.`,
      );
    }

    if (
      scores.colors <
      thresholds.minimumColors
    ) {
      failures.push(
        `Color score ${scores.colors} is below ${thresholds.minimumColors}.`,
      );
    }

    if (
      scores.proportions <
      thresholds.minimumProportions
    ) {
      failures.push(
        `Proportion score ${scores.proportions} is below ${thresholds.minimumProportions}.`,
      );
    }

    if (
      scores.signatureElements <
      thresholds.minimumSignatureElements
    ) {
      failures.push(
        `Signature element score ${scores.signatureElements} is below ${thresholds.minimumSignatureElements}.`,
      );
    }

    if (
      scores.continuity <
      thresholds.minimumContinuity
    ) {
      failures.push(
        `Continuity score ${scores.continuity} is below ${thresholds.minimumContinuity}.`,
      );
    }

    if (
      scores.style <
      thresholds.minimumStyle
    ) {
      warnings.push(
        `Style score ${scores.style} is below ${thresholds.minimumStyle}.`,
      );
    }

    if (
      scores.total <
      thresholds.minimumTotal
    ) {
      failures.push(
        `Total score ${scores.total} is below ${thresholds.minimumTotal}.`,
      );
    }

    const status =
      failures.length > 0
        ? 'failed'
        : warnings.length > 0
          ? 'warning'
          : 'passed';

    const now =
      new Date().toISOString();

    const test:
      ProviderMigrationTest = {
        migrationTestId:
          randomUUID(),

        worldId:
          dto.worldId,

        bibleId:
          dto.bibleId,

        entityType:
          dto.entityType,

        entityId:
          dto.entityId,

        entityName:
          fingerprint.entityName,

        currentProviderId:
          dto.currentProviderId,

        candidateProviderId:
          dto.candidateProviderId,

        workload:
          dto.workload,

        scores,
        thresholds,
        status,

        productionAllowed:
          false,

        rollbackProviderId:
          dto.currentProviderId,

        failures,
        warnings,

        humanApprovalRequired:
          status !== 'failed',

        approvedByHuman:
          false,

        createdAt: now,
        updatedAt: now,
      };

    await this.memory
      .saveProviderMigrationTest(
        dto.worldId,
        test,
      );

    return {
      success: true,

      engine:
        'CreatorOS Provider Migration Consistency Gate',

      version: '1.0.0',

      status:
        test.status,

      test,
    };
  }

  async review(
    dto: ReviewProviderMigrationDto,
  ) {
    const tests =
      await this.memory
        .loadProviderMigrationTests(
          dto.worldId,
        );

    const test =
      tests.find(
        (item) =>
          item.migrationTestId ===
          dto.migrationTestId,
      );

    if (!test) {
      throw new NotFoundException(
        `Migration test not found: ${dto.migrationTestId}.`,
      );
    }

    if (
      dto.approved &&
      test.status === 'failed'
    ) {
      throw new BadRequestException(
        'A failed migration test cannot be approved.',
      );
    }

    test.approvedByHuman =
      dto.approved;

    test.productionAllowed =
      dto.approved;

    test.status =
      dto.approved
        ? 'approved'
        : 'rejected';

    test.updatedAt =
      new Date().toISOString();

    await this.memory
      .saveProviderMigrationTest(
        dto.worldId,
        test,
      );

    let providerLock:
      ProviderEntityLock | null = null;

    if (dto.approved) {
      providerLock = {
        lockId:
          randomUUID(),

        worldId:
          test.worldId,

        entityType:
          test.entityType,

        entityId:
          test.entityId,

        entityName:
          test.entityName,

        workload:
          test.workload,

        providerId:
          test.candidateProviderId,

        migrationTestId:
          test.migrationTestId,

        locked: true,

        fallbackProviderId:
          test.currentProviderId,

        createdAt:
          new Date().toISOString(),

        updatedAt:
          new Date().toISOString(),
      };

      await this.memory
        .saveProviderEntityLock(
          dto.worldId,
          providerLock,
        );
    }

    return {
      success: true,

      status:
        test.status,

      test,
      providerLock,
      notes:
        dto.notes,
    };
  }

  async getTests(
    worldId: string,
  ) {
    return this.memory
      .loadProviderMigrationTests(
        worldId,
      );
  }

  async getLocks(
    worldId: string,
  ) {
    return this.memory
      .loadProviderEntityLocks(
        worldId,
      );
  }

  getStatus() {
    return {
      success: true,

      engine:
        'CreatorOS Provider Migration Consistency Gate',

      version: '1.0.0',

      phase:
        'Provider Migration Validation and Locking',

      status: 'operational',

      architecture: {
        migrationTestEngine: true,
        canonicalFingerprintIntegration:
          true,

        compatibilityLayerIntegration:
          true,

        identityThresholdGate:
          true,

        providerApprovalGate:
          true,

        perEntityProviderLock:
          true,

        rollbackProvider:
          true,

        productionBlocking:
          true,

        permanentMigrationStorage:
          true,
      },

      thresholds: {
        identity: 95,
        colors: 95,
        proportions: 95,
        signatureElements: 95,
        style: 92,
        continuity: 97,
        total: 97,
      },
    };
  }

  private totalScore(
    dto: RunProviderMigrationTestDto,
  ): number {
    const total =
      dto.identityScore * 0.3 +
      dto.colorScore * 0.15 +
      dto.proportionScore * 0.15 +
      dto.signatureElementScore * 0.15 +
      dto.styleScore * 0.1 +
      dto.continuityScore * 0.15;

    return (
      Math.round(
        total * 100,
      ) / 100
    );
  }
}

