import { Injectable } from '@nestjs/common';
import { MediaAssetInput } from './media-enterprise-expansion.types';

@Injectable()
export class AiLicensingEngineService {
  build(input: MediaAssetInput) {
    const readiness = Math.max(
      0,
      Math.min(
        1,
        ((input.originality ?? 0.7) +
          (input.scalability ?? 0.65) +
          (input.strategicScore ?? 0.7) -
          (input.risk ?? 0.3)) /
          3,
      ),
    );

    return {
      readiness: Number(readiness.toFixed(3)),
      models: [
        'format-license',
        'territory-license',
        'language-license',
        'character-license',
        'merchandising-license',
        'education-license',
        'platform-syndication',
        'white-label-production',
      ],
      approved: false,
    };
  }
}