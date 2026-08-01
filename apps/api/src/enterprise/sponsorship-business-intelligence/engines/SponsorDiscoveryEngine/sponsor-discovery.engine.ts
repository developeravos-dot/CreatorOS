import { Injectable } from "@nestjs/common";

export interface SponsorCandidate {
  id: string;
  name: string;
  industry: string;
  country: string;
  priority: number;
}

@Injectable()
export class SponsorDiscoveryEngine {

  discover(): SponsorCandidate[] {

    return [

      {
        id: "brand-001",
        name: "Tech Vision",
        industry: "Technology",
        country: "UAE",
        priority: 95,
      },

      {
        id: "brand-002",
        name: "Kids Planet",
        industry: "Children",
        country: "Saudi Arabia",
        priority: 90,
      },

      {
        id: "brand-003",
        name: "Future Energy",
        industry: "Energy",
        country: "UAE",
        priority: 82,
      },

    ];
  }
}
