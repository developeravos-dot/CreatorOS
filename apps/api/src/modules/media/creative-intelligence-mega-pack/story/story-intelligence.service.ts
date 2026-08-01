import { Injectable } from '@nestjs/common';
import { CreativeProjectBrief, StoryArchitecture } from '../creative-intelligence.types';

@Injectable()
export class StoryIntelligenceService {
  build(brief: CreativeProjectBrief): StoryArchitecture {
    const genre = brief.genre ?? brief.contentType;

    return {
      premise: `${brief.title}: ${brief.concept}`,
      theme: this.themeFor(brief),
      centralQuestion: `What must change for the central idea of ${brief.title} to succeed?`,
      hook: `Open with the most surprising or emotionally charged consequence of ${brief.concept}.`,
      acts: [
        {
          order: 1,
          name: 'Promise',
          purpose: 'Establish the world, audience promise and central tension.',
          turningPoint: 'The central question becomes unavoidable.',
        },
        {
          order: 2,
          name: 'Escalation',
          purpose: 'Deepen conflict, discovery and emotional investment.',
          turningPoint: 'The old approach fails and a new path is required.',
        },
        {
          order: 3,
          name: 'Transformation',
          purpose: 'Resolve the central tension through a meaningful change.',
          turningPoint: 'The final choice proves the theme.',
        },
      ],
      emotionalArc: this.emotionalArc(genre),
      ending: 'Deliver a satisfying resolution while preserving a path for expansion or sequel.',
    };
  }

  private themeFor(brief: CreativeProjectBrief) {
    const text = `${brief.concept} ${brief.genre ?? ''}`.toLowerCase();

    if (text.includes('future') || text.includes('technology')) {
      return 'Technology matters only when it expands human possibility responsibly.';
    }

    if (text.includes('mystery')) {
      return 'Truth requires persistence, courage and better questions.';
    }

    if (text.includes('children') || text.includes('kids')) {
      return 'Curiosity and cooperation transform difficult problems.';
    }

    return 'Meaningful progress requires clarity, courage and transformation.';
  }

  private emotionalArc(genre: string) {
    const text = genre.toLowerCase();

    if (text.includes('mystery')) {
      return ['curiosity', 'uncertainty', 'suspense', 'discovery', 'resolution'];
    }

    if (text.includes('children') || text.includes('animation')) {
      return ['wonder', 'connection', 'challenge', 'courage', 'joy'];
    }

    return ['curiosity', 'connection', 'tension', 'revelation', 'satisfaction'];
  }
}