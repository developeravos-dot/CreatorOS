import { Module } from '@nestjs/common';
import { MediaEcosystemService } from './media-ecosystem.service';
import { MediaEcosystemController } from './media-ecosystem.controller';

@Module({
  providers: [MediaEcosystemService],
  controllers: [MediaEcosystemController]
})
export class MediaEcosystemModule {}
