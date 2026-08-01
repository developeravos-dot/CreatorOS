import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class OfferArchitectureStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Offer Architecture', 'offer-architecture');
  }
}
