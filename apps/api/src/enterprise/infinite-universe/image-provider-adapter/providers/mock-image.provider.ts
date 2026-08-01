import { Injectable } from '@nestjs/common';
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
export class MockImageProvider
  implements ImageProviderAdapter
{
  readonly providerId =
    'mock-image' as const;

  getCapabilities():
    ImageProviderCapabilities {
    return {
      providerId:
        this.providerId,

      displayName:
        'CreatorOS Mock Image Provider',

      available: true,
      configured: true,

      capabilities: {
        textToImage: true,
        referenceImageInput: false,
        negativePrompt: true,
        multipleImages: true,
        transparentBackground: false,
        deterministicSeed: true,
      },

      executionMode:
        'simulation',

      limitations: [
        'مزود اختبار فقط.',
        'لا ينتج ملفات صور حقيقية.',
        'لا يستخدم في الإنتاج النهائي.',
      ],
    };
  }

  async execute(
    request: ImageGenerationRequest,
  ): Promise<ImageProviderExecutionResult> {
    const assets:
      GeneratedImageAsset[] =
      Array.from(
        {
          length:
            request.imageCount,
        },

        (_, index) => ({
          assetId: randomUUID(),

          requestId:
            request.requestId,

          providerId:
            this.providerId,

          providerAssetId:
            `mock-${request.requestId}-${index + 1}`,

          category:
            request.category,

          sourceEntityId:
            request.sourceEntityId,

          sourceEntityName:
            request.sourceEntityName,

          imageUrl:
            `mock://images/${request.requestId}/${index + 1}`,

          mimeType:
            'image/png',

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
            'approval-required' as const,

          approval: {
            required: true,
            approved: false,
          },

          createdAt:
            new Date().toISOString(),
        }),
      );

    return {
      success: true,
      providerId:
        this.providerId,

      status: 'generated',
      assets,
      errors: [],

      warnings: [
        'هذه نتائج محاكاة ولا تحتوي على صور حقيقية.',
      ],
    };
  }
}
