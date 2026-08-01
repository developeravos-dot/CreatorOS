import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class CreatorServiceBusinessStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Creator Service Business', 'creator-service-business');
  }
}
