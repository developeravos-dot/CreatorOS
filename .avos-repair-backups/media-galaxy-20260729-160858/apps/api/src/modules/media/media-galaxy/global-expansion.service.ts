import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalExpansionService {
  build(markets: string[], languages: string[]) {
    return {
      markets,
      languages,
      engines: ['Country Engine', 'Language Engine', 'Culture Engine', 'Compliance Engine', 'Publishing Matrix'],
      launchGates: ['audience fit', 'localization quality', 'rights clearance', 'platform readiness', 'human approval'],
      matrix: markets.flatMap((market) => languages.map((language) => ({ market, language, status: 'planned' }))),
    };
  }
}
