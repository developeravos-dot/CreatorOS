import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { loadEnvironment } from './environment';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [loadEnvironment],
    }),
  ],
  exports: [ConfigModule],
})
export class CreatorOsConfigurationModule {}