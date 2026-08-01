import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import type {
  ImageGenerationJob,
  ImageGenerationRequest,
  ImageProviderId,
} from '../models/image-provider.models';

export interface EpisodeProviderCohesionResult {
  storyboardId?: string;

  characterAssignments: Array<{
    characterId: string;
    characterName: string;
    providerId: ImageProviderId;
    source: 'existing-job' | 'current-job';
  }>;

  environmentProviders:
    ImageProviderId[];

  propProviders:
    ImageProviderId[];

  conflicts: Array<{
    characterId: string;
    characterName: string;
    existingProviderId:
      ImageProviderId;

    requestedProviderId:
      ImageProviderId;

    existingJobId?: string;
  }>;

  passed: boolean;
}

@Injectable()
export class EpisodeProviderCohesionEngine {
  enforce(
    storyboardId: string | undefined,
    currentRequests:
      ImageGenerationRequest[],

    existingJobs:
      ImageGenerationJob[],
  ): EpisodeProviderCohesionResult {
    const result:
      EpisodeProviderCohesionResult = {
        storyboardId,

        characterAssignments: [],
        environmentProviders: [],
        propProviders: [],
        conflicts: [],
        passed: true,
      };

    if (!storyboardId) {
      this.collectCurrentAssignments(
        currentRequests,
        result,
      );

      return result;
    }

    const episodeJobs =
      existingJobs.filter(
        (job) =>
          job.storyboardId ===
          storyboardId &&
          job.status !== 'failed',
      );

    const existingCharacters =
      new Map<
        string,
        {
          characterName: string;
          providerId: ImageProviderId;
          jobId: string;
        }
      >();

    for (const job of episodeJobs) {
      for (const request of job.requests) {
        const character =
          this.characterIdentity(
            request,
          );

        if (!character) {
          continue;
        }

        const providerId =
          request.resolvedProviderId ??
          request.providerId;

        const previous =
          existingCharacters.get(
            character.characterId,
          );

        if (
          previous &&
          previous.providerId !==
            providerId
        ) {
          throw new BadRequestException(
            [
              'Existing episode provider cohesion is already inconsistent.',
              `Character: ${character.characterName}.`,
              `Provider A: ${previous.providerId}.`,
              `Provider B: ${providerId}.`,
              `Storyboard: ${storyboardId}.`,
            ].join(' '),
          );
        }

        existingCharacters.set(
          character.characterId,
          {
            characterName:
              character.characterName,

            providerId,
            jobId:
              job.jobId,
          },
        );
      }
    }

    const currentCharacters =
      new Map<
        string,
        {
          characterName: string;
          providerId: ImageProviderId;
        }
      >();

    for (
      const request of
      currentRequests
    ) {
      const providerId =
        request.resolvedProviderId ??
        request.providerId;

      if (
        request.sourceEntityType ===
        'environment'
      ) {
        if (
          !result.environmentProviders
            .includes(providerId)
        ) {
          result.environmentProviders
            .push(providerId);
        }

        continue;
      }

      if (
        request.sourceEntityType ===
        'prop'
      ) {
        if (
          !result.propProviders
            .includes(providerId)
        ) {
          result.propProviders
            .push(providerId);
        }

        continue;
      }

      const character =
        this.characterIdentity(
          request,
        );

      if (!character) {
        continue;
      }

      const currentPrevious =
        currentCharacters.get(
          character.characterId,
        );

      if (
        currentPrevious &&
        currentPrevious.providerId !==
          providerId
      ) {
        result.conflicts.push({
          characterId:
            character.characterId,

          characterName:
            character.characterName,

          existingProviderId:
            currentPrevious.providerId,

          requestedProviderId:
            providerId,
        });

        continue;
      }

      currentCharacters.set(
        character.characterId,
        {
          characterName:
            character.characterName,

          providerId,
        },
      );

      const existing =
        existingCharacters.get(
          character.characterId,
        );

      if (
        existing &&
        existing.providerId !==
          providerId
      ) {
        result.conflicts.push({
          characterId:
            character.characterId,

          characterName:
            character.characterName,

          existingProviderId:
            existing.providerId,

          requestedProviderId:
            providerId,

          existingJobId:
            existing.jobId,
        });
      }
    }

    for (
      const [
        characterId,
        existing,
      ] of existingCharacters
    ) {
      result.characterAssignments
        .push({
          characterId,

          characterName:
            existing.characterName,

          providerId:
            existing.providerId,

          source:
            'existing-job',
        });
    }

    for (
      const [
        characterId,
        current,
      ] of currentCharacters
    ) {
      const alreadyAdded =
        result.characterAssignments
          .some(
            (assignment) =>
              assignment.characterId ===
              characterId,
          );

      if (!alreadyAdded) {
        result.characterAssignments
          .push({
            characterId,

            characterName:
              current.characterName,

            providerId:
              current.providerId,

            source:
              'current-job',
          });
      }
    }

    result.passed =
      result.conflicts.length === 0;

    if (!result.passed) {
      const details =
        result.conflicts
          .map(
            (conflict) =>
              [
                conflict.characterName,
                conflict.existingProviderId,
                conflict.requestedProviderId,
              ].join(' : '),
          )
          .join(' | ');

      throw new BadRequestException(
        [
          'Episode provider cohesion violation.',
          'The same character cannot use different providers inside the same episode.',
          `Storyboard: ${storyboardId}.`,
          `Conflicts: ${details}.`,
          'Run and approve a provider migration before changing the provider.',
        ].join(' '),
      );
    }

    return result;
  }

  private collectCurrentAssignments(
    requests:
      ImageGenerationRequest[],

    result:
      EpisodeProviderCohesionResult,
  ): void {
    const seenCharacters =
      new Set<string>();

    for (const request of requests) {
      const providerId =
        request.resolvedProviderId ??
        request.providerId;

      if (
        request.sourceEntityType ===
        'environment'
      ) {
        if (
          !result.environmentProviders
            .includes(providerId)
        ) {
          result.environmentProviders
            .push(providerId);
        }

        continue;
      }

      if (
        request.sourceEntityType ===
        'prop'
      ) {
        if (
          !result.propProviders
            .includes(providerId)
        ) {
          result.propProviders
            .push(providerId);
        }

        continue;
      }

      const character =
        this.characterIdentity(
          request,
        );

      if (
        !character ||
        seenCharacters.has(
          character.characterId,
        )
      ) {
        continue;
      }

      seenCharacters.add(
        character.characterId,
      );

      result.characterAssignments
        .push({
          characterId:
            character.characterId,

          characterName:
            character.characterName,

          providerId,

          source:
            'current-job',
        });
    }
  }

  private characterIdentity(
    request:
      ImageGenerationRequest,
  ):
    | {
        characterId: string;
        characterName: string;
      }
    | undefined {
    if (
      request.sourceEntityType !==
      'character'
    ) {
      return undefined;
    }

    const metadataCharacterId =
      request.metadata.characterId;

    const characterId =
      typeof metadataCharacterId ===
        'string' &&
      metadataCharacterId.trim()
        ? metadataCharacterId
        : request.sourceEntityId;

    const metadataCharacterName =
      request.metadata.characterName;

    const characterName =
      typeof metadataCharacterName ===
        'string' &&
      metadataCharacterName.trim()
        ? metadataCharacterName
        : request.sourceEntityName
            .split(' - ')[0]
            ?.trim() ||
          request.sourceEntityName;

    return {
      characterId,
      characterName,
    };
  }
}
