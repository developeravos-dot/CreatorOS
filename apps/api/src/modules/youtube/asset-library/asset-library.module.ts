import { Module } from '@nestjs/common';

import {
  AssetLibraryController,
} from './asset-library.controller';

import {
  AssetLibraryService,
} from './asset-library.service';

@Module({
  controllers: [AssetLibraryController],
  providers: [AssetLibraryService],
  exports: [AssetLibraryService],
})
export class AssetLibraryModule {}
