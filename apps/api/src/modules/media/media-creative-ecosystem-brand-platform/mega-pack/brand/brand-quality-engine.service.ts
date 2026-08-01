import { Injectable } from '@nestjs/common';
import { BrandProgram } from '../media-mega.types';

@Injectable()
export class BrandQualityEngineService {
  evaluate(program: BrandProgram) {
    const assets = program.assets.length;
    const languages = program.localization.languages.length;

    return {
      consistencyScore: Math.min(100, 80 + assets),
      recognitionScore: 92,
      differentiationScore: 90,
      growthRecommendations: [
        languages < 3 ? 'add-third-language-market' : 'expand-local-market-variants',
        'test-thumbnail-recognition',
        'measure-sonic-logo-recall',
        'create-seasonal-identity-system',
        'measure-cross-platform-consistency',
      ],
    };
  }
}