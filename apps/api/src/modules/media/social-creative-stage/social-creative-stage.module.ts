import { Module } from '@nestjs/common';
import { SocialCreativeStageController } from './social-creative-stage.controller';
import { SocialCreativeStageService } from './social-creative-stage.service';

@Module({
  controllers: [SocialCreativeStageController],
  providers: [SocialCreativeStageService],
  exports: [SocialCreativeStageService],
})
export class SocialCreativeStageModule {}
