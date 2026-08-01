import { Module } from '@nestjs/common';
import { DependencyController } from './dependency.controller';
import { DependencyService } from './dependency.service';

@Module({
  controllers: [DependencyController],
  providers: [DependencyService],
  exports: [DependencyService],
})
export class DependencyModule {}
