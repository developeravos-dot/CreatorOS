import { Module } from '@nestjs/common';
import { VisualIdentityStageController } from './visual-identity-stage.controller';
import { VisualIdentityStageService } from './visual-identity-stage.service';

@Module({
  controllers: [VisualIdentityStageController],
  providers: [VisualIdentityStageService],
  exports: [VisualIdentityStageService],
})
export class VisualIdentityStageModule {}
