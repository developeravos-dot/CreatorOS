import { Module } from '@nestjs/common';

import { MediaEcosystemController } from './media-ecosystem.controller';
import { MediaEcosystemService } from './media-ecosystem.service';

@Module({
  controllers: [MediaEcosystemController],
  providers: [MediaEcosystemService],
  exports: [MediaEcosystemService],
})
export class MediaEcosystemModule {}
