import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { HeartbeatJob } from './heartbeat.job';

@Global()
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 30_000,
      max: 500,
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [HeartbeatJob],
  exports: [CacheModule, ScheduleModule],
})
export class CreatorOsRuntimeModule {}