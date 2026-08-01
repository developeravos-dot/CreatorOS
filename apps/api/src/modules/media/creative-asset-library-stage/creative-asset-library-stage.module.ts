import { Module } from '@nestjs/common';
import { CreativeAssetLibraryStageController } from './creative-asset-library-stage.controller';
import { CreativeAssetLibraryStageService } from './creative-asset-library-stage.service';

@Module({
  controllers: [CreativeAssetLibraryStageController],
  providers: [CreativeAssetLibraryStageService],
  exports: [CreativeAssetLibraryStageService],
})
export class CreativeAssetLibraryStageModule {}
