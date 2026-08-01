import { Injectable } from '@nestjs/common';
import { GlobalMediaProgramInput } from './media-global-operating-system.types';

@Injectable()
export class GlobalDistributionEngineService {
  build(input: GlobalMediaProgramInput) {
    return {
      channels: [
        ...input.platforms,
        'owned-media',
        'partner-networks',
        'syndication',
        'licensing',
      ],
      marketRoutes: [
        ...input.markets,
        'regional-hubs',
        'global-release',
        'market-specific-launches',
      ],
      localizationRoutes: [
        ...input.languages,
        'subtitles',
        'dubbing',
        'cultural-adaptation',
        'localized-packaging',
      ],
    };
  }
}