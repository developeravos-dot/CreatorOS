import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class BusinessClientSolutionsStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Business Client Solutions', 'business-client-solutions');
  }
}
