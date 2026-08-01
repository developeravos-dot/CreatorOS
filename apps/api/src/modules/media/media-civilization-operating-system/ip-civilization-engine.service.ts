import { Injectable } from '@nestjs/common';
import { CivilizationProgramInput } from './media-civilization.types';

@Injectable()
export class IpCivilizationEngineService {
  build(input: CivilizationProgramInput) {
    return {
      assets: [
        'characters',
        'formats',
        'stories',
        'worlds',
        'brands',
        'music',
        'educational-systems',
        'software',
      ],
      families: [
        `${input.name}:core-IP-family`,
        `${input.civilizationDomain}:domain-IP-family`,
        ...input.languages?.map((language) => `${language}:localized-IP-family`) ?? [],
      ],
      licensingModels: [
        'territory-license',
        'language-license',
        'format-license',
        'platform-license',
        'commercial-franchise',
        'education-license',
      ],
      provenanceRules: [
        'creator-attribution',
        'source-traceability',
        'version-history',
        'rights-chain',
        'human-approval-for-transfer',
      ],
    };
  }
}