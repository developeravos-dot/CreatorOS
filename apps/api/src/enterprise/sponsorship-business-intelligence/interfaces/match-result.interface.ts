export interface MatchResult {
  sponsorId: string;

  brandId: string;

  score: number;

  confidence: number;

  reasons: string[];
}
