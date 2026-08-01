import type {
  ImageGenerationRequest,
  ImageProviderCapabilities,
  ImageProviderExecutionResult,
  ImageProviderId,
} from '../models/image-provider.models';

export interface ImageProviderAdapter {
  readonly providerId: ImageProviderId;

  getCapabilities():
    ImageProviderCapabilities;

  execute(
    request: ImageGenerationRequest,
  ): Promise<ImageProviderExecutionResult>;
}
