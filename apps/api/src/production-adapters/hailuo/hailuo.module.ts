import { Module } from '@nestjs/common';
import { HailuoAdapter } from './hailuo.adapter';
import { HailuoController } from './hailuo.controller';

@Module({
  controllers: [HailuoController],
  providers: [HailuoAdapter],
  exports: [HailuoAdapter],
})
export class HailuoModule {}