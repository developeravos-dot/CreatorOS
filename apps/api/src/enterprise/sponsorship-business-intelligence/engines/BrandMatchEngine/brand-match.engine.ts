import { Injectable } from "@nestjs/common";

import { MatchResult } from "../../interfaces/match-result.interface";

@Injectable()
export class BrandMatchEngine {

  calculate(
    sponsorId: string,
    brandId: string,
  ): MatchResult {

    return {
      sponsorId,
      brandId,

      score: 75,

      confidence: 80,

      reasons: [
        "Audience alignment",
        "Content category compatibility",
        "Language compatibility",
        "Geographic compatibility",
      ],
    };
  }
}
