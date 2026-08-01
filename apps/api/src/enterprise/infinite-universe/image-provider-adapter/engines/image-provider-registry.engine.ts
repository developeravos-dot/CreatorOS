import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ManualExportImageProvider } from '../providers/manual-export-image.provider';
import { MockImageProvider } from '../providers/mock-image.provider';
import { OpenAiImageProvider } from '../providers/openai-image.provider';

import type {
  ImageProviderAdapter,
} from '../providers/image-provider.adapter';

import type {
  ImageProviderId,
} from '../models/image-provider.models';

@Injectable()
export class ImageProviderRegistry {
  private readonly providers:
    Map<
      ImageProviderId,
      ImageProviderAdapter
    >;

  constructor(
    manualExport:
      ManualExportImageProvider,

    mockImage:
      MockImageProvider,

    openAiImage:
      OpenAiImageProvider,
  ) {
    this.providers =
      new Map<
        ImageProviderId,
        ImageProviderAdapter
      >();

    this.providers.set(
      manualExport.providerId,
      manualExport,
    );

    this.providers.set(
      mockImage.providerId,
      mockImage,
    );

    this.providers.set(
      openAiImage.providerId,
      openAiImage,
    );
  }

  get(
    providerId: ImageProviderId,
  ): ImageProviderAdapter {
    const provider =
      this.providers.get(
        providerId,
      );

    if (!provider) {
      throw new NotFoundException(
        `Image provider not found: ${providerId}.`,
      );
    }

    return provider;
  }

  list() {
    return [
      ...this.providers.values(),
    ].map(
      (provider) =>
        provider.getCapabilities(),
    );
  }
}
