import { Injectable } from '@nestjs/common';
import { MediaAssetInput } from './media-enterprise-expansion.types';

@Injectable()
export class GlobalLocalizationEngineService {
  build(input: MediaAssetInput) {
    const markets = input.targetMarkets?.length
      ? input.targetMarkets
      : ['UAE', 'Saudi Arabia', 'United States', 'United Kingdom'];

    const languages = input.languages?.length
      ? input.languages
      : ['Arabic', 'English'];

    return {
      markets,
      languages,
      adaptations: [
        'cultural-context-adaptation',
        'title-and-thumbnail-localization',
        'voice-and-dubbing',
        'subtitle-localization',
        'market-specific-compliance',
        'platform-format-adaptation',
      ],
    };
  }
}