import { Injectable } from '@nestjs/common';
import { MediaAssetInput } from './media-enterprise-expansion.types';

@Injectable()
export class MediaCommerceEngineService {
  build(input: MediaAssetInput) {
    return {
      products: [
        `${input.title}-digital-guide`,
        `${input.title}-premium-series`,
        `${input.title}-membership`,
        `${input.title}-licensed-assets`,
        `${input.title}-education-pack`,
      ],
      channels: [
        'owned-store',
        'marketplaces',
        'affiliate-network',
        'platform-commerce',
        'business-licensing',
      ],
    };
  }
}