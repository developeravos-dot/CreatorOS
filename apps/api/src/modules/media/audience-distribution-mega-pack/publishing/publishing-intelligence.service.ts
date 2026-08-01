import { Injectable } from '@nestjs/common';
import {
  DistributionBrief,
  PublishingPlan,
} from '../audience-distribution.types';

@Injectable()
export class PublishingIntelligenceService {
  build(brief: DistributionBrief): PublishingPlan {
    const platforms = brief.platforms ?? ['YouTube', 'TikTok', 'Instagram'];

    return {
      platforms: platforms.map((platform, index) => ({
        platform,
        format: this.formatFor(platform),
        cadence: index === 0 ? 'primary-release' : 'supporting-distribution',
        titleStrategy: 'clear-value-plus-curiosity',
        metadataStrategy: 'localized-search-and-discovery-metadata',
        releasePriority: index + 1,
      })),
      schedule: platforms.flatMap((platform, platformIndex) => [
        {
          order: platformIndex * 3 + 1,
          platform,
          action: 'publish-primary-or-adapted-version',
          timing: brief.releaseWindow ?? `window-${platformIndex + 1}`,
        },
        {
          order: platformIndex * 3 + 2,
          platform,
          action: 'publish-supporting-short',
          timing: `after-primary-${platformIndex + 1}`,
        },
        {
          order: platformIndex * 3 + 3,
          platform,
          action: 'collect-performance-signal',
          timing: `post-release-analysis-${platformIndex + 1}`,
        },
      ]),
      experiments: [
        'hook-test',
        'thumbnail-test',
        'language-test',
        'publishing-time-test',
        'cross-platform-sequence-test',
      ],
    };
  }

  private formatFor(platform: string) {
    const text = platform.toLowerCase();

    if (
      text.includes('tiktok') ||
      text.includes('reels') ||
      text.includes('short')
    ) {
      return '9:16';
    }

    if (text.includes('instagram')) return '1:1-and-9:16';
    return '16:9';
  }
}