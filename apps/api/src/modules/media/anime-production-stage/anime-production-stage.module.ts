import { Module } from '@nestjs/common';
import { AnimeProductionStageController } from './anime-production-stage.controller';
import { AnimeProductionStageService } from './anime-production-stage.service';

@Module({
  controllers: [AnimeProductionStageController],
  providers: [AnimeProductionStageService],
  exports: [AnimeProductionStageService],
})
export class AnimeProductionStageModule {}
