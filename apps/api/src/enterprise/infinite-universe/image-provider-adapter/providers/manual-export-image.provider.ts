import { Injectable } from '@nestjs/common';

import {
  mkdir,
  writeFile,
} from 'node:fs/promises';

import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

import type {
  GeneratedImageAsset,
  ImageGenerationRequest,
  ImageProviderCapabilities,
  ImageProviderExecutionResult,
} from '../models/image-provider.models';

import type {
  ImageProviderAdapter,
} from './image-provider.adapter';

@Injectable()
export class ManualExportImageProvider
  implements ImageProviderAdapter
{
  readonly providerId =
    'manual-export' as const;

  private readonly exportRoot =
    process.env
      .CREATOROS_IMAGE_EXPORT_PATH
      ?.trim() ||
    join(
      process.cwd(),
      'data',
      'infinite-universe',
      'image-provider',
      'manual-export',
    );

  getCapabilities():
    ImageProviderCapabilities {
    return {
      providerId:
        this.providerId,

      displayName:
        'Manual Prompt Export Provider',

      available: true,
      configured: true,

      capabilities: {
        textToImage: false,
        referenceImageInput: false,
        negativePrompt: true,
        multipleImages: true,
        transparentBackground: false,
        deterministicSeed: false,
      },

      executionMode:
        'manual-export',

      limitations: [
        'لا يولد صورًا تلقائيًا.',
        'يصدر ملفات JSON وTXT جاهزة للاستخدام في مولد صور خارجي.',
        'يجب إعادة الصور الناتجة واعتمادها لاحقًا.',
      ],
    };
  }

  async execute(
    request: ImageGenerationRequest,
  ): Promise<ImageProviderExecutionResult> {
    const requestDirectory =
      join(
        this.exportRoot,
        this.safeId(request.worldId),
        this.safeId(request.requestId),
      );

    await mkdir(
      requestDirectory,
      { recursive: true },
    );

    const jsonFile =
      join(
        requestDirectory,
        'request.json',
      );

    const promptFile =
      join(
        requestDirectory,
        'prompt.txt',
      );

    const negativeFile =
      join(
        requestDirectory,
        'negative-prompt.txt',
      );

    await writeFile(
      jsonFile,
      JSON.stringify(
        request,
        null,
        2,
      ),
      'utf8',
    );

    await writeFile(
      promptFile,
      request.prompt,
      'utf8',
    );

    await writeFile(
      negativeFile,
      request.negativePrompt,
      'utf8',
    );

    const asset:
      GeneratedImageAsset = {
        assetId: randomUUID(),
        requestId:
          request.requestId,

        providerId:
          this.providerId,

        category:
          request.category,

        sourceEntityId:
          request.sourceEntityId,

        sourceEntityName:
          request.sourceEntityName,

        exportPath:
          requestDirectory,

        mimeType:
          'application/json',

        width:
          request.width,

        height:
          request.height,

        prompt:
          request.prompt,

        negativePrompt:
          request.negativePrompt,

        continuityKeys: [
          ...request.continuityKeys,
        ],

        status:
          'approval-required',

        approval: {
          required: true,
          approved: false,
        },

        createdAt:
          new Date().toISOString(),
      };

    return {
      success: true,
      providerId:
        this.providerId,

      status: 'exported',

      assets: [asset],
      errors: [],

      warnings: [
        'تم تصدير الطلب فقط ولم تُولد صورة فعلية.',
      ],
    };
  }

  private safeId(
    value: string,
  ): string {
    const safe =
      value.replace(
        /[^a-zA-Z0-9_-]/g,
        '',
      );

    if (!safe) {
      throw new Error(
        'Invalid export identifier.',
      );
    }

    return safe;
  }
}
