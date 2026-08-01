import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { MediaAssetInput } from './media-enterprise-expansion.types';

@Injectable()
export class ContentIpBuilderService {
  build(input: MediaAssetInput) {
    const fingerprint = createHash('sha256')
      .update(`${input.title}|${input.concept}|${input.category}`)
      .digest('hex');

    return {
      fingerprint,
      universe: `${input.title} Universe`,
      extensions: [
        'series',
        'short-form',
        'documentary',
        'book',
        'course',
        'interactive-experience',
        'licensed-format',
        'brand',
      ],
      rightsStatus: 'unverified' as const,
    };
  }
}