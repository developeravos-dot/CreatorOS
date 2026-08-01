import { Injectable } from '@nestjs/common';
import { IpBrandGrowthProgram } from '../ip-brand-growth.types';

@Injectable()
export class IpBrandGrowthQualityService {
  evaluate(program: IpBrandGrowthProgram) {
    const scores = {
      ipCoverage: program.ipAssets.length >= 4 ? 95 : 60,
      franchiseReadiness:
        program.franchise.expansionPaths.length >= 4 ? 93 : 65,
      brandEvolution:
        program.brandEvolution.brandPillars.length >= 5 ? 94 : 60,
      marketingReadiness:
        program.marketing.campaigns.length >= 3 ? 92 : 60,
      growthReadiness: program.growth.loops.length >= 4 ? 93 : 60,
      monetizationDiversity:
        program.monetization.revenueStreams.length >= 5 ? 95 : 55,
      partnershipReadiness:
        program.partnerships.targets.length >= 4 ? 92 : 60,
      licensingReadiness:
        program.licensing.packages.length >= 4 ? 94 : 60,
      governance: program.governance.humanApproved ? 100 : 70,
    };

    const failures = Object.entries(scores)
      .filter(([, score]) => score < 80)
      .map(([name]) => `${name}-below-threshold`);

    return {
      scores,
      failures,
      approved: failures.length === 0 && program.governance.humanApproved,
    };
  }
}