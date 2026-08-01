import { Injectable } from '@nestjs/common';

import type { LivingWorld } from '../../world-engine/models/world-engine.models';
import type { EndlessEpisode } from '../models/episode-engine.models';

@Injectable()
export class StoryThreadSelectorEngine {
  select(
    world: LivingWorld,
    previousEpisodes: EndlessEpisode[],
    preferredStoryThread?: string,
  ): {
    primary: string;
    secondary: string[];
    repetitionScore: number;
  } {
    const candidates = [
      ...world.endlessState.activeMysteries,
      ...world.endlessState.activeConflicts,
      ...world.endlessState.futureSeeds,
    ];

    if (
      preferredStoryThread &&
      candidates.includes(
        preferredStoryThread,
      )
    ) {
      return {
        primary:
          preferredStoryThread,

        secondary:
          candidates
            .filter(
              (candidate) =>
                candidate !==
                preferredStoryThread,
            )
            .slice(0, 2),

        repetitionScore:
          this.repetitionScore(
            preferredStoryThread,
            previousEpisodes,
          ),
      };
    }

    const ranked =
      candidates
        .map(
          (candidate, index) => ({
            candidate,

            score:
              100 -
              this.repetitionScore(
                candidate,
                previousEpisodes,
              ) -
              index * 2,
          }),
        )
        .sort(
          (left, right) =>
            right.score - left.score,
        );

    const primary =
      ranked[0]?.candidate ??
      'اكتشاف حدث جديد داخل العالم';

    return {
      primary,

      secondary:
        ranked
          .slice(1, 3)
          .map(
            (item) =>
              item.candidate,
          ),

      repetitionScore:
        this.repetitionScore(
          primary,
          previousEpisodes,
        ),
    };
  }

  private repetitionScore(
    thread: string,
    previousEpisodes:
      EndlessEpisode[],
  ): number {
    const recent =
      previousEpisodes.slice(-8);

    const count =
      recent.filter(
        (episode) =>
          episode.sourceStoryThread ===
          thread,
      ).length;

    return Math.min(
      100,
      count * 25,
    );
  }
}
