import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BrandBrief } from '../media-mega.types';

@Injectable()
export class BrandAssetsEngineService {
  build(brief: BrandBrief) {
    const languages = brief.languages ?? ['Arabic', 'English'];
    const shared = [
      ['logo', 'Primary Logo'],
      ['logo', 'Symbol Mark'],
      ['banner', 'Channel Banner'],
      ['profile', 'Profile Image'],
      ['template', 'Thumbnail Master'],
      ['template', 'Social Post Master'],
      ['template', 'Campaign Master'],
      ['document', 'Brand Book'],
      ['motion', 'Motion Identity'],
      ['audio', 'Sonic Identity'],
    ] as const;

    const assets = shared.map(([type, name]) => ({
      id: randomUUID(),
      type,
      name,
      version: '1.0.0',
      status: 'planned' as const,
    }));

    for (const language of languages) {
      assets.push({
        id: randomUUID(),
        type: 'localization',
        name: `${language} Brand Applications`,
        version: '1.0.0',
        status: 'planned',
      });
    }

    return assets;
  }
}