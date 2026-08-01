import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  CharacterProfile,
  CreativeProjectBrief,
  StoryArchitecture,
} from '../creative-intelligence.types';

@Injectable()
export class CharacterIntelligenceService {
  build(
    brief: CreativeProjectBrief,
    story: StoryArchitecture,
  ): CharacterProfile[] {
    const primaryId = randomUUID();
    const guideId = randomUUID();
    const opposingId = randomUUID();

    return [
      {
        id: primaryId,
        name: 'Primary Character',
        role: 'protagonist',
        objective: `Resolve the central question: ${story.centralQuestion}`,
        conflict: 'Internal doubt and external resistance.',
        personality: ['curious', 'determined', 'human', 'adaptable'],
        appearance: [
          'locked-face-ratios',
          'locked-hair',
          'locked-height-and-proportions',
          'platform-safe-readable-silhouette',
        ],
        wardrobe: ['primary-look', 'challenge-look', 'resolution-look'],
        voice: `${brief.tone ?? 'clear'} emotionally grounded voice`,
        behaviorRules: [
          'acts from clear motivation',
          'does not change personality without story cause',
          'shows growth through decisions',
        ],
        continuityFingerprint: `CHAR-${primaryId}`,
      },
      {
        id: guideId,
        name: 'Guide Character',
        role: 'mentor-or-knowledge-source',
        objective: 'Reveal useful context without replacing the protagonist.',
        conflict: 'Knows more than can be revealed immediately.',
        personality: ['calm', 'precise', 'trustworthy'],
        appearance: ['distinctive-silhouette', 'controlled-color-code'],
        wardrobe: ['guide-signature-look'],
        voice: 'authoritative but human',
        behaviorRules: [
          'supports but does not solve everything',
          'reveals information progressively',
        ],
        continuityFingerprint: `CHAR-${guideId}`,
      },
      {
        id: opposingId,
        name: 'Opposing Force',
        role: 'antagonistic-pressure',
        objective: 'Protect the status quo or create the central obstacle.',
        conflict: 'Its logic must be understandable even when harmful.',
        personality: ['focused', 'strategic', 'consistent'],
        appearance: ['contrasting-silhouette', 'controlled-visual-language'],
        wardrobe: ['opposition-signature-look'],
        voice: 'controlled and intentional',
        behaviorRules: [
          'creates escalating pressure',
          'acts according to a coherent worldview',
        ],
        continuityFingerprint: `CHAR-${opposingId}`,
      },
    ];
  }
}