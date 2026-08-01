import { Injectable } from '@nestjs/common';
import { CivilizationProgramInput } from './media-civilization.types';

@Injectable()
export class CivilizationCommerceEngineService {
  build(input: CivilizationProgramInput) {
    return {
      marketplaces: [
        'creator-marketplace',
        'IP-exchange',
        'advertising-marketplace',
        'services-marketplace',
        'education-marketplace',
        'technology-marketplace',
      ],
      partnerNetworks: [
        'distribution-network',
        'creator-network',
        'technology-network',
        'institutional-network',
        ...input.regions?.map((region) => `${region}:regional-network`) ?? [],
      ],
      tradeFlows: [
        'content-to-audience',
        'IP-to-licensee',
        'service-to-enterprise',
        'knowledge-to-learner',
        'data-to-decision',
      ],
    };
  }
}