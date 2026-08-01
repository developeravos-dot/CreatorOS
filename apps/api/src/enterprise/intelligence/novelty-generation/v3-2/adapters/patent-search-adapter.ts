import type {
  NormalizedPatentDocument,
  PatentSearchProviderStatus,
  PatentSearchRequest,
} from '../models/novelty-v3-2.models';

export interface PatentSearchAdapter {
  getStatus(): PatentSearchProviderStatus;

  search(
    request: PatentSearchRequest,
  ): Promise<NormalizedPatentDocument[]>;
}
