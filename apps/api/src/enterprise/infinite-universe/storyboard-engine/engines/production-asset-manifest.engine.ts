import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import type {
  LivingCharacter,
} from '../../character-os/models/character-os.models';

import type {
  StoryboardScene,
  ProductionAsset,
} from '../models/storyboard.models';

@Injectable()
export class ProductionAssetManifestEngine {
  create(
    characters: LivingCharacter[],
    scenes: StoryboardScene[],
  ): ProductionAsset[] {
    const assets: ProductionAsset[] =
      [];

    for (const character of characters) {
      assets.push({
        assetId: randomUUID(),

        type:
          'character-reference',

        name:
          `مرجع ${character.identity.canonicalName}`,

        description:
          character.identity.visualDescription,

        required: true,
        reusable: true,

        relatedCharacterIds: [
          character.identity.characterId,
        ],

        relatedSceneNumbers:
          scenes
            .filter(
              (scene) =>
                scene.frames.some(
                  (frame) =>
                    frame.characters.some(
                      (item) =>
                        item.characterId ===
                        character.identity.characterId,
                    ),
                ),
            )
            .map(
              (scene) =>
                scene.sceneNumber,
            ),

        relatedFrameNumbers: [],

        status: 'planned',
      });
    }

    const locations =
      [
        ...new Set(
          scenes.map(
            (scene) =>
              scene.location,
          ),
        ),
      ];

    for (const location of locations) {
      assets.push({
        assetId: randomUUID(),

        type:
          'environment-reference',

        name:
          `بيئة ${location}`,

        description:
          `مرجع بصري ثابت لموقع ${location}.`,

        required: true,
        reusable: true,

        relatedCharacterIds: [],

        relatedSceneNumbers:
          scenes
            .filter(
              (scene) =>
                scene.location ===
                location,
            )
            .map(
              (scene) =>
                scene.sceneNumber,
            ),

        relatedFrameNumbers: [],

        status: 'planned',
      });
    }

    for (const scene of scenes) {
      for (const frame of scene.frames) {
        assets.push({
          assetId: randomUUID(),

          type: 'shot-image',

          name:
            `المشهد ${scene.sceneNumber} اللقطة ${frame.frameNumber}`,

          description:
            frame.description,

          required: true,
          reusable: false,

          relatedCharacterIds:
            frame.characters.map(
              (character) =>
                character.characterId,
            ),

          relatedSceneNumbers: [
            scene.sceneNumber,
          ],

          relatedFrameNumbers: [
            frame.frameNumber,
          ],

          status: 'planned',
        });
      }
    }

    return assets;
  }
}
