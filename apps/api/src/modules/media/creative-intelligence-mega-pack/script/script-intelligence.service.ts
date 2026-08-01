import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  CreativeProjectBrief,
  ScriptPackage,
  StoryArchitecture,
} from '../creative-intelligence.types';

@Injectable()
export class ScriptIntelligenceService {
  build(
    brief: CreativeProjectBrief,
    story: StoryArchitecture,
  ): ScriptPackage {
    const total = Math.max(30, brief.durationSeconds ?? 300);
    const sceneCount = Math.max(6, Math.min(36, Math.ceil(total / 20)));
    const baseDuration = Math.floor(total / sceneCount);
    const remainder = total - baseDuration * sceneCount;

    const fallbackAct = {
      order: 1,
      name: 'Narrative',
      purpose: 'Advance the story clearly and coherently.',
      turningPoint: 'The narrative moves toward resolution.',
    };

    return {
      logline: `${story.premise} while confronting ${story.centralQuestion.toLowerCase()}`,
      synopsis: `${story.hook} The story progresses through ${story.acts
        .map((act) => act.name)
        .join(', ')} and concludes with ${story.ending.toLowerCase()}`,
      scenes: Array.from({ length: sceneCount }, (_, index) => {
        const actIndex = Math.min(
          Math.max(0, story.acts.length - 1),
          Math.floor(index / Math.ceil(sceneCount / 3)),
        );

        const act = story.acts[actIndex] ?? story.acts[0] ?? fallbackAct;

        return {
          id: randomUUID(),
          order: index + 1,
          heading: `SCENE ${index + 1} — ${act.name.toUpperCase()}`,
          purpose:
            index === 0
              ? 'hook'
              : index === sceneCount - 1
                ? 'resolution'
                : act.purpose,
          dialogue: [
            `Character dialogue advances scene ${index + 1}.`,
            'Dialogue must reveal intention, conflict or change.',
          ],
          narration: [
            index === 0
              ? story.hook
              : `Narration connects scene ${index + 1} to the central question.`,
          ],
          durationSeconds: baseDuration + (index < remainder ? 1 : 0),
        };
      }),
      continuityNotes: [
        'Preserve timeline continuity.',
        'Preserve character motivation continuity.',
        'Preserve environment continuity.',
        'Avoid repeated exposition.',
        'Maintain platform-appropriate pacing.',
      ],
      languageVersions: (brief.languages ?? ['Arabic', 'English']).map(
        (language) => ({
          language,
          status: 'planned',
        }),
      ),
    };
  }
}