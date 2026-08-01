import { Module } from '@nestjs/common';

import { PermanentUniverseMemoryModule } from '../persistent-memory/permanent-universe-memory.module';
import { ProviderCompatibilityModule } from '../provider-compatibility-layer/provider-compatibility.module';

import { EpisodeProviderCohesionEngine } from './engines/episode-provider-cohesion.engine';
import { ImageGenerationRequestBuilder } from './engines/image-generation-request-builder.engine';
import { ImageProviderRegistry } from './engines/image-provider-registry.engine';

import { ManualExportImageProvider } from './providers/manual-export-image.provider';
import { MockImageProvider } from './providers/mock-image.provider';
import { OpenAiImageProvider } from './providers/openai-image.provider';

import { ImageProviderAdapterController } from './image-provider-adapter.controller';
import { ImageProviderAdapterService } from './image-provider-adapter.service';

@Module({
  imports: [
    PermanentUniverseMemoryModule,
    ProviderCompatibilityModule,
  ],

  controllers: [
    ImageProviderAdapterController,
  ],

  providers: [
    ImageProviderAdapterService,
    ImageProviderRegistry,
    ImageGenerationRequestBuilder,
    EpisodeProviderCohesionEngine,
    ManualExportImageProvider,
    MockImageProvider,
    OpenAiImageProvider,
  ],

  exports: [
    ImageProviderAdapterService,
  ],
})
export class ImageProviderAdapterModule {}


