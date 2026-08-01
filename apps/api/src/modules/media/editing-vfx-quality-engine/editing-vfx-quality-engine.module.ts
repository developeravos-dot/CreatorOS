import { Module } from '@nestjs/common';

import {
  EditingVfxQualityEngineController,
} from './editing-vfx-quality-engine.controller';

import {
  EditingVfxQualityEngineService,
} from './editing-vfx-quality-engine.service';

@Module({
  controllers: [EditingVfxQualityEngineController],
  providers: [EditingVfxQualityEngineService],
  exports: [EditingVfxQualityEngineService],
})
export class EditingVfxQualityEngineModule {}
