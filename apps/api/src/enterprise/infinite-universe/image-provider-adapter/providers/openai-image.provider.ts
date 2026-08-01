import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import {
  mkdir,
  writeFile,
} from 'node:fs/promises';

import {
  join,
} from 'node:path';

import {
  randomUUID,
} from 'node:crypto';

import type {
  GeneratedImageAsset,
  ImageGenerationRequest,
  ImageProviderCapabilities,
  ImageProviderExecutionResult,
} from '../models/image-provider.models';

import type {
  ImageProviderAdapter,
} from './image-provider.adapter';

interface OpenAiImageApiResponse {
  created?: number;

  data?: Array<{
    b64_json?: string;
    url?: string;
    revised_prompt?: string;
  }>;

  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
}

@Injectable()
export class OpenAiImageProvider
  implements ImageProviderAdapter
{
  readonly providerId =
    'openai-image' as const;

  private readonly outputRoot =
    process.env
      .CREATOROS_OPENAI_IMAGE_OUTPUT_PATH
      ?.trim() ||
    join(
      process.cwd(),
      'data',
      'infinite-universe',
      'image-provider',
      'openai-image',
    );

  getCapabilities():
    ImageProviderCapabilities {
    const configured =
      Boolean(
        process.env
          .OPENAI_API_KEY
          ?.trim(),
      );

    return {
      providerId:
        this.providerId,

      displayName:
        'OpenAI Image Provider',

      available: true,
      configured,

      capabilities: {
        textToImage: true,

        // سيدعم الصور المرجعية في مرحلة Image Edit التالية.
        referenceImageInput: false,

        // يتم دمج القيود السلبية داخل Prompt.
        negativePrompt: true,

        multipleImages: true,
        transparentBackground: true,
        deterministicSeed: false,
      },

      executionMode:
        'external-api',

      limitations: [
        'يتطلب OPENAI_API_KEY.',
        'الاستخدام الحقيقي قد يترتب عليه استهلاك مدفوع.',
        'Seed ثابت غير مدعوم في هذا المحول.',
        'الصور المرجعية ستضاف في مرحلة Image Edit.',
        'يجب اجتياز Provider Migration Gate قبل اعتماده للشخصيات.',
      ],
    };
  }

  async execute(
    request: ImageGenerationRequest,
  ): Promise<ImageProviderExecutionResult> {
    const apiKey =
      process.env
        .OPENAI_API_KEY
        ?.trim();

    if (!apiKey) {
      throw new BadRequestException(
        'OPENAI_API_KEY is not configured.',
      );
    }

    const model =
      process.env
        .OPENAI_IMAGE_MODEL
        ?.trim() ||
      'gpt-image-1-mini';

    const size =
      this.resolveSize(
        request.width,
        request.height,
      );

    const quality =
      this.resolveQuality();

    const prompt =
      this.buildPrompt(
        request,
      );

    const response =
      await fetch(
        'https://api.openai.com/v1/images/generations',
        {
          method: 'POST',

          headers: {
            Authorization:
              `Bearer ${apiKey}`,

            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            model,
            prompt,
            size,
            quality,

            n: request.imageCount,

            output_format:
              'png',

            background:
              'opaque',
          }),
        },
      );

    const payload =
      await response.json() as
        OpenAiImageApiResponse;

    if (!response.ok) {
      const message =
        payload.error?.message ??
        `OpenAI image request failed with HTTP ${response.status}.`;

      return {
        success: false,

        providerId:
          this.providerId,

        status: 'failed',

        assets: [],

        errors: [
          message,
        ],

        warnings: [],
      };
    }

    const images =
      payload.data ?? [];

    if (images.length === 0) {
      return {
        success: false,

        providerId:
          this.providerId,

        status: 'failed',

        assets: [],

        errors: [
          'OpenAI returned no image data.',
        ],

        warnings: [],
      };
    }

    const requestDirectory =
      join(
        this.outputRoot,
        this.safeId(
          request.worldId,
        ),
        this.safeId(
          request.requestId,
        ),
      );

    await mkdir(
      requestDirectory,
      { recursive: true },
    );

    const assets:
      GeneratedImageAsset[] = [];

    for (
      let index = 0;
      index < images.length;
      index += 1
    ) {
      const image =
        images[index];

      if (!image) {
        continue;
      }

      const assetId =
        randomUUID();

      let localPath:
        string | undefined;

      let imageUrl:
        string | undefined;

      if (image.b64_json) {
        localPath =
          join(
            requestDirectory,
            `${assetId}.png`,
          );

        await writeFile(
          localPath,
          Buffer.from(
            image.b64_json,
            'base64',
          ),
        );
      } else if (image.url) {
        imageUrl =
          image.url;
      } else {
        continue;
      }

      assets.push({
        assetId,

        requestId:
          request.requestId,

        providerId:
          this.providerId,

        providerAssetId:
          `openai-${request.requestId}-${index + 1}`,

        category:
          request.category,

        sourceEntityId:
          request.sourceEntityId,

        sourceEntityName:
          request.sourceEntityName,

        imageUrl,
        localPath,

        mimeType:
          'image/png',

        width:
          this.outputWidth(size),

        height:
          this.outputHeight(size),

        prompt,

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
      });
    }

    if (assets.length === 0) {
      return {
        success: false,

        providerId:
          this.providerId,

        status: 'failed',

        assets: [],

        errors: [
          'OpenAI response contained no usable image output.',
        ],

        warnings: [],
      };
    }

    return {
      success: true,

      providerId:
        this.providerId,

      status: 'generated',

      assets,

      errors: [],

      warnings: [
        `Generated with ${model}.`,
        'Human approval and visual consistency validation are required before production use.',
      ],
    };
  }

  private buildPrompt(
    request: ImageGenerationRequest,
  ): string {
    return [
      request.prompt,

      request.identityLockPrompt
        ? `IDENTITY LOCK: ${request.identityLockPrompt}`
        : '',

      request.negativePrompt
        ? `STRICTLY AVOID: ${request.negativePrompt}`
        : '',

      'Preserve the exact canonical identity, wardrobe, proportions, colors, signature elements, visual style, and audience suitability.',

      'Do not redesign or reinterpret the character.',
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  private resolveQuality():
    'low' | 'medium' | 'high' | 'auto' {
    const value =
      process.env
        .OPENAI_IMAGE_QUALITY
        ?.trim()
        .toLowerCase();

    if (
      value === 'low' ||
      value === 'medium' ||
      value === 'high'
    ) {
      return value;
    }

    return 'low';
  }

  private resolveSize(
    width: number,
    height: number,
  ):
    | '1024x1024'
    | '1024x1536'
    | '1536x1024' {
    if (height > width) {
      return '1024x1536';
    }

    if (width > height) {
      return '1536x1024';
    }

    return '1024x1024';
  }

  private outputWidth(
    size: string,
  ): number {
    return Number(
      size.split('x')[0],
    );
  }

  private outputHeight(
    size: string,
  ): number {
    return Number(
      size.split('x')[1],
    );
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
      throw new BadRequestException(
        'Invalid OpenAI image output identifier.',
      );
    }

    return safe;
  }
}
