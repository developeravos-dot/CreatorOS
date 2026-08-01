import { Injectable } from '@nestjs/common';

@Injectable()
export class DigitalDnaService {
  build(name: string, audience: string, platforms: string[]) {
    return {
      brandDna: { identity: name, promise: `Distinctive media value for ${audience}`, traits: ['original', 'premium', 'adaptive'] },
      contentDna: { pillars: ['story', 'insight', 'emotion', 'utility'], originalityRequired: true },
      audienceDna: { primary: audience, needs: ['relevance', 'trust', 'memorability'] },
      channelDna: platforms.map((platform) => ({ platform, nativeFormatRequired: true })),
      creatorDna: { voice: ['clear', 'confident', 'culturally aware'], humanReview: true },
    };
  }
}
