import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { LoggingModule } from '../logging/logging.module';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';

@Module({
  imports: [
    ConfigModule,
    LoggingModule,
  ],
  controllers: [CoreController],
  providers: [CoreService],
  exports: [CoreService],
})
export class CoreModule {}
