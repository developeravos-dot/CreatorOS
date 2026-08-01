import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { GlobalMediaProgramInput } from './media-global-operating-system.types';

@Injectable()
export class RightsLicensingEngineService {
  build(input: GlobalMediaProgramInput) {
    return {
      fingerprint: createHash('sha256')
        .update(`${input.name}|${input.vision}|${input.category}`)
        .digest('hex'),
      rightsStatus: 'pending' as const,
      licensingModels: [
        'territory-license',
        'language-license',
        'format-license',
        'character-license',
        'education-license',
        'brand-license',
        'platform-license',
      ],
    };
  }
}