import { Injectable } from '@nestjs/common';

import {
  MediaIpFranchiseEngineBase,
} from '../media-ip-franchise-core/media-ip-franchise-engine.base';

@Injectable()
export class MediaIpRegistryEngineService extends MediaIpFranchiseEngineBase {
  constructor() {
    super('AVOS Media Intellectual Property Registry Engine');
  }
}
