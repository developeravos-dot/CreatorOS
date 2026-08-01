import { Injectable } from '@nestjs/common';
import { MediaAssetInput } from './media-enterprise-expansion.types';

@Injectable()
export class CreatorPartnershipPlatformService {
  build(input: MediaAssetInput) {
    const category = input.category.toLowerCase();

    return {
      candidates: [
        `${category}-creator-network`,
        'regional-creators',
        'global-specialists',
        'subject-matter-experts',
        'production-partners',
        'distribution-partners',
      ],
      active: [],
    };
  }
}