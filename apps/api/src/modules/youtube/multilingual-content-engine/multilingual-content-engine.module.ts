import { Module } from '@nestjs/common';

import {
  MultilingualContentEngineController,
} from './multilingual-content-engine.controller';

import {
  MultilingualContentEngineService,
} from './multilingual-content-engine.service';

@Module({
  controllers: [MultilingualContentEngineController],
  providers: [MultilingualContentEngineService],
  exports: [MultilingualContentEngineService],
})
export class MultilingualContentEngineModule {}
