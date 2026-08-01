import { Module } from '@nestjs/common';

import { PermanentUniverseMemoryController } from './permanent-universe-memory.controller';
import { PermanentUniverseMemoryService } from './permanent-universe-memory.service';

@Module({
  controllers: [
    PermanentUniverseMemoryController,
  ],

  providers: [
    PermanentUniverseMemoryService,
  ],

  exports: [
    PermanentUniverseMemoryService,
  ],
})
export class PermanentUniverseMemoryModule {}
