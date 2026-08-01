import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EcosystemBrief } from '../media-mega.types';

@Injectable()
export class EcosystemPortfolioEngineService {
  build(brief: EcosystemBrief) {
    const projects = brief.projects?.length
      ? brief.projects
      : [`${brief.name} Core IP`];

    return projects.map((project, index) => ({
      id: randomUUID(),
      title: project,
      stage: index === 0 ? 'validation' : 'concept',
      valueScore: Math.max(0.5, 0.82 - index * 0.05),
      riskScore: Math.min(0.8, 0.25 + index * 0.05),
      expansionPaths: [
        'series',
        'new-season',
        'new-language',
        'book',
        'course',
        'game',
        'product',
        'partnership',
        'license',
        'brand',
      ],
    }));
  }
}