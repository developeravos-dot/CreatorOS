export interface BusinessDNA {
  dnaId: string;

  intelligenceVersion: number;

  confidenceScore: number;

  tags: string[];

  attributes: Record<string, unknown>;

  createdAt: string;

  updatedAt: string;
}
