import { Module } from '@nestjs/common';
import { CharacterDevelopmentStageController } from './character-development-stage.controller';
import { CharacterDevelopmentStageService } from './character-development-stage.service';

@Module({
  controllers: [CharacterDevelopmentStageController],
  providers: [CharacterDevelopmentStageService],
  exports: [CharacterDevelopmentStageService],
})
export class CharacterDevelopmentStageModule {}
