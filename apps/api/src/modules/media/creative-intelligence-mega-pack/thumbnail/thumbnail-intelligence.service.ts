import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  CreativeProjectBrief,
  ThumbnailPlan,
} from '../creative-intelligence.types';

@Injectable()
export class ThumbnailIntelligenceService {
  build(brief: CreativeProjectBrief): ThumbnailPlan {
    return {
      concepts: [
        {
          id: randomUUID(),
          headline: this.shortHeadline(brief.title),
          visualFocus: 'single-primary-subject',
          emotion: 'curiosity',
          composition: 'subject-left-title-right',
          contrastStrategy: 'bright-subject-dark-background',
        },
        {
          id: randomUUID(),
          headline: 'What Changes Everything?',
          visualFocus: 'before-and-after-or-reveal',
          emotion: 'surprise',
          composition: 'split-or-center-reveal',
          contrastStrategy: 'opposing-color-fields',
        },
        {
          id: randomUUID(),
          headline: 'The Hidden Truth',
          visualFocus: 'mystery-object-or-face',
          emotion: 'suspense',
          composition: 'extreme-close-up',
          contrastStrategy: 'one-bright-accent',
        },
      ],
      rules: [
        'one-primary-idea',
        'maximum-four-words',
        'mobile-readable',
        'high-subject-background-separation',
        'no-small-details',
        'no-misleading-claim',
        'preserve-brand-code',
      ],
      platformVariants: [
        'youtube-16:9',
        'shorts-9:16',
        'social-1:1',
        'story-9:16',
      ],
    };
  }

  private shortHeadline(title: string) {
    return title.split(' ').slice(0, 4).join(' ');
  }
}