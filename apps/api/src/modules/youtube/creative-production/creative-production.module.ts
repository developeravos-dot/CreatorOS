import { Module } from '@nestjs/common';

import { CreativeProductionController } from './creative-production.controller';
import { CreativeProductionService } from './creative-production.service';

@Module({
  controllers: [CreativeProductionController],
  providers: [CreativeProductionService],
  exports: [CreativeProductionService],
})
export class CreativeProductionModule {}
