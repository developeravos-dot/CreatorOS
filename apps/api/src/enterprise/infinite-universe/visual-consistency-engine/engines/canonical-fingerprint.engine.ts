import { Injectable } from '@nestjs/common';

import {
  createHash,
  randomUUID,
} from 'node:crypto';

import type {
  VisualReferenceBible,
} from '../../visual-reference-bible/models/visual-reference-bible.models';

import type {
  CanonicalIdentityFingerprint,
} from '../models/visual-consistency.models';

@Injectable()
export class CanonicalFingerprintEngine {
  create(
    worldId: string,
    bible: VisualReferenceBible,
    locked: boolean,
  ): CanonicalIdentityFingerprint[] {
    const now =
      new Date().toISOString();

    const fingerprints:
      CanonicalIdentityFingerprint[] = [];

    for (
      const reference of
      bible.characterReferences
    ) {
      const values = {
        identityDescription: [
          reference.canonicalIdentity
            .visualDescription,

          reference.canonicalIdentity
            .faceShape,

          reference.canonicalIdentity
            .hairDescription,

          reference.canonicalIdentity
            .eyeDescription,

          reference.canonicalIdentity
            .bodyProportions,

          reference.canonicalIdentity
            .wardrobeDescription,
        ].join(' | '),

        primaryColors:
          reference.colorPalette.map(
            (color) =>
              `${color.name}:${color.hex}`,
          ),

        proportions: [
          `height:${reference.canonicalIdentity.heightUnits}`,

          reference.canonicalIdentity
            .bodyProportions,

          `apparent-age:${reference.canonicalIdentity.apparentAge}`,
        ],

        signatureElements: [
          ...reference.canonicalIdentity
            .signatureElements,
        ],

        continuityKeys: [
          ...reference.continuityKeys,
        ],

        identityLockPrompt:
          reference.identityLockPrompt,

        negativePrompt:
          reference.negativeIdentityPrompt,
      };

      fingerprints.push(
        this.build(
          worldId,
          bible.bibleId,
          'character',
          reference.characterId,
          reference.characterName,
          values,
          locked,
          now,
        ),
      );
    }

    for (
      const reference of
      bible.environmentReferences
    ) {
      const values = {
        identityDescription: [
          reference.canonicalDescription,
          reference.architecturalLanguage,
          reference.emotionalTone,
        ].join(' | '),

        primaryColors:
          reference.colorPalette.map(
            (color) =>
              `${color.name}:${color.hex}`,
          ),

        proportions: [
          ...reference.cameraLandmarks,
        ],

        signatureElements: [
          ...reference.recurringObjects,
          ...reference.materials,
        ],

        continuityKeys: [
          ...reference.continuityKeys,
        ],

        identityLockPrompt: [
          reference.canonicalPrompt,
          ...reference.prohibitedChanges,
        ].join('. '),

        negativePrompt:
          reference.negativePrompt,
      };

      fingerprints.push(
        this.build(
          worldId,
          bible.bibleId,
          'environment',
          reference.referenceId,
          reference.locationName,
          values,
          locked,
          now,
        ),
      );
    }

    for (
      const reference of
      bible.propReferences
    ) {
      const values = {
        identityDescription: [
          reference.description,
          reference.material,
          reference.scaleDescription,
        ].join(' | '),

        primaryColors:
          reference.colors.map(
            (color) =>
              `${color.name}:${color.hex}`,
          ),

        proportions: [
          reference.scaleDescription,
        ],

        signatureElements: [
          ...reference.functionalBehavior,
        ],

        continuityKeys: [
          ...reference.continuityKeys,
        ],

        identityLockPrompt:
          reference.canonicalPrompt,

        negativePrompt:
          reference.negativePrompt,
      };

      fingerprints.push(
        this.build(
          worldId,
          bible.bibleId,
          'prop',
          reference.referenceId,
          reference.propName,
          values,
          locked,
          now,
        ),
      );
    }

    return fingerprints;
  }

  private build(
    worldId: string,
    bibleId: string,

    entityType:
      CanonicalIdentityFingerprint['entityType'],

    entityId: string,
    entityName: string,

    canonicalValues:
      CanonicalIdentityFingerprint['canonicalValues'],

    locked: boolean,
    now: string,
  ): CanonicalIdentityFingerprint {
    const normalized =
      JSON.stringify(
        canonicalValues,
      );

    const fingerprintHash =
      createHash('sha256')
        .update(normalized)
        .digest('hex');

    return {
      fingerprintId:
        randomUUID(),

      worldId,
      bibleId,

      entityType,
      entityId,
      entityName,

      canonicalValues,
      fingerprintHash,

      locked,
      version: 1,

      createdAt: now,
      updatedAt: now,
    };
  }
}
