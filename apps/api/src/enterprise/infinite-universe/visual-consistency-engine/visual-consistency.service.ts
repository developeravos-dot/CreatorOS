import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import { PermanentUniverseMemoryService } from '../persistent-memory/permanent-universe-memory.service';

import { CreateCanonicalFingerprintsDto } from './dto/create-canonical-fingerprints.dto';
import { ValidateVisualConsistencyDto } from './dto/validate-visual-consistency.dto';

import { CanonicalFingerprintEngine } from './engines/canonical-fingerprint.engine';
import { ConsistencyPromptRepairEngine } from './engines/consistency-prompt-repair.engine';
import { VisualIdentityValidatorEngine } from './engines/visual-identity-validator.engine';

import type {
  VisualConsistencyValidation,
  VisualGenerationSnapshot,
} from './models/visual-consistency.models';

@Injectable()
export class VisualConsistencyService {
  constructor(
    private readonly memory:
      PermanentUniverseMemoryService,

    private readonly fingerprintEngine:
      CanonicalFingerprintEngine,

    private readonly validator:
      VisualIdentityValidatorEngine,

    private readonly repairEngine:
      ConsistencyPromptRepairEngine,
  ) {}

  async createFingerprints(
    dto: CreateCanonicalFingerprintsDto,
  ) {
    const bibles =
      await this.memory
        .loadVisualReferenceBibles(
          dto.worldId,
        );

    const bible =
      bibles.find(
        (item) =>
          item.bibleId ===
          dto.bibleId,
      );

    if (!bible) {
      throw new NotFoundException(
        `Visual Reference Bible not found: ${dto.bibleId}.`,
      );
    }

    const fingerprints =
      this.fingerprintEngine.create(
        dto.worldId,
        bible,
        dto.lockAfterCreation ??
          true,
      );

    await this.memory
      .saveCanonicalFingerprints(
        dto.worldId,
        fingerprints,
      );

    return {
      success: true,

      engine:
        'CreatorOS Character and Visual Consistency Engine',

      version: '1.0.0',

      status:
        'canonical-fingerprints-created',

      summary: {
        total:
          fingerprints.length,

        characters:
          fingerprints.filter(
            (item) =>
              item.entityType ===
              'character',
          ).length,

        environments:
          fingerprints.filter(
            (item) =>
              item.entityType ===
              'environment',
          ).length,

        props:
          fingerprints.filter(
            (item) =>
              item.entityType ===
              'prop',
          ).length,

        locked:
          fingerprints.filter(
            (item) =>
              item.locked,
          ).length,
      },

      fingerprints,
    };
  }

  async validate(
    dto: ValidateVisualConsistencyDto,
  ) {
    const fingerprints =
      await this.memory
        .loadCanonicalFingerprints(
          dto.worldId,
        );

    const fingerprint =
      fingerprints.find(
        (item) =>
          item.bibleId ===
            dto.bibleId &&
          item.entityType ===
            dto.entityType &&
          item.entityId ===
            dto.entityId,
      );

    if (!fingerprint) {
      throw new NotFoundException(
        `Canonical fingerprint not found for ${dto.entityType}:${dto.entityId}.`,
      );
    }

    const snapshot:
      VisualGenerationSnapshot = {
        snapshotId: randomUUID(),

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

        providerId:
          dto.providerId,

        prompt:
          dto.prompt,

        negativePrompt:
          dto.negativePrompt,

        continuityKeys:
          dto.continuityKeys ??
          [],

        outputAssetId:
          dto.outputAssetId,

        outputLocation:
          dto.outputLocation,

        extractedValues: {
          identityDescription:
            dto.identityDescription,

          colors:
            dto.colors,

          proportions:
            dto.proportions,

          signatureElements:
            dto.signatureElements,
        },

        createdAt:
          new Date().toISOString(),
      };

    const validationBase =
      this.validator.validate(
        fingerprint,
        snapshot,
      );

    const validation:
      VisualConsistencyValidation = {
        validationId:
          randomUUID(),

        ...validationBase,

        createdAt:
          new Date().toISOString(),
      };

    if (
      validation.repairRequired
    ) {
      const repaired =
        this.repairEngine.repair(
          fingerprint,
          snapshot,
          validation,
        );

      validation.repairedPrompt =
        repaired.repairedPrompt;

      validation.repairedNegativePrompt =
        repaired.repairedNegativePrompt;
    }

    await this.memory
      .saveVisualConsistencySnapshot(
        dto.worldId,
        snapshot,
      );

    await this.memory
      .saveVisualConsistencyValidation(
        dto.worldId,
        validation,
      );

    return {
      success: true,

      engine:
        'CreatorOS Character and Visual Consistency Engine',

      version: '1.0.0',

      status:
        validation.status,

      validation,
    };
  }

  async getFingerprints(
    worldId: string,
  ) {
    return this.memory
      .loadCanonicalFingerprints(
        worldId,
      );
  }

  async getValidations(
    worldId: string,
  ) {
    return this.memory
      .loadVisualConsistencyValidations(
        worldId,
      );
  }

  getStatus() {
    return {
      success: true,

      engine:
        'CreatorOS Character and Visual Consistency Engine',

      version: '1.0.0',

      phase:
        'Canonical Identity Lock and Drift Detection',

      status: 'operational',

      architecture: {
        canonicalFingerprintEngine:
          true,

        identityLockEngine:
          true,

        colorConsistencyEngine:
          true,

        proportionConsistencyEngine:
          true,

        signatureElementValidator:
          true,

        promptRepairEngine:
          true,

        providerIndependentValidation:
          true,

        humanApprovalGate:
          true,

        permanentConsistencyStorage:
          true,
      },

      thresholds: {
        minimumPassingScore: 90,
        warningScore: 75,
        criticalIdentityScore: 60,
      },
    };
  }
}
