import { Injectable } from '@nestjs/common';
import { AutonomousInitiativeInput } from './media-autonomous-enterprise.types';

@Injectable()
export class OpportunityMarketplaceEngineService {
  build(input: AutonomousInitiativeInput) {
    return {
      offerings: [
        'content-IP',
        'production-capability',
        'distribution-access',
        'audience-intelligence',
        'licensing',
        'technology-services',
      ],
      demandSignals: [
        `${input.initiativeType}:active-demand`,
        ...input.markets?.map((market) => `${market}:market-demand`) ?? [],
      ],
      matches: input.partners?.map(
        (partner) => `${partner}:potential-match`,
      ) ?? [],
    };
  }
}