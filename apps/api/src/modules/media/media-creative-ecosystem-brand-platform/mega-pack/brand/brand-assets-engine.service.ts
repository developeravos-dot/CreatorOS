import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BrandBrief, BrandProgram } from '../media-mega.types';

@Injectable()
export class BrandAssetsEngineService {
  build(brief: BrandBrief): BrandProgram['assets'] {
    const languages = brief.languages ?? ['Arabic', 'English'];

    const assets: BrandProgram['assets'] = [
      {
        id: randomUUID(),
        type: 'logo',
        name: 'Primary Logo',
        version: '1.0.0',
        status: 'planned',
      },
      {
        id: randomUUID(),
        type: 'logo',
        name: 'Symbol Mark',
        version: '1.0.0',
        status: 'planned',
      },
      {
        id: randomUUID(),
        type: 'banner',
        name: 'Channel Banner',
        version: '1.0.0',
        status: 'planned',
      },
      {
        id: randomUUID(),
        type: 'profile',
        name: 'Profile Image',
        version: '1.0.0',
        status: 'planned',
      },
      {
        id: randomUUID(),
        type: 'template',
        name: 'Thumbnail Master',
        version: '1.0.0',
        status: 'planned',
      },
      {
        id: randomUUID(),
        type: 'template',
        name: 'Social Post Master',
        version: '1.0.0',
        status: 'planned',
      },
      {
        id: randomUUID(),
        type: 'template',
        name: 'Campaign Master',
        version: '1.0.0',
        status: 'planned',
      },
      {
        id: randomUUID(),
        type: 'document',
        name: 'Brand Book',
        version: '1.0.0',
        status: 'planned',
      },
      {
        id: randomUUID(),
        type: 'motion',
        name: 'Motion Identity',
        version: '1.0.0',
        status: 'planned',
      },
      {
        id: randomUUID(),
        type: 'audio',
        name: 'Sonic Identity',
        version: '1.0.0',
        status: 'planned',
      },
    ];

    for (const language of languages) {
      assets.push({
        id: randomUUID(),
        type: 'localization',
        name: `${language} Brand Applications`,
        version: '1.0.0',
        status: 'planned',
        locale: language,
      });
    }

    return assets;
  }
}