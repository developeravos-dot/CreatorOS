import { Module } from '@nestjs/common';
import { MediaEmpireCommandController } from './media-empire-command.controller';
import { MediaEmpireCommandService } from './media-empire-command.service';

@Module({
  controllers: [MediaEmpireCommandController],
  providers: [MediaEmpireCommandService],
  exports: [MediaEmpireCommandService],
})
export class MediaEmpireCommandModule {}
