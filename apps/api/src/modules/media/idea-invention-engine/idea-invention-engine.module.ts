import { Module } from '@nestjs/common';

import {
  IdeaInventionEngineController,
} from './idea-invention-engine.controller';

import {
  IdeaInventionEngineService,
} from './idea-invention-engine.service';

@Module({
  controllers: [IdeaInventionEngineController],
  providers: [IdeaInventionEngineService],
  exports: [IdeaInventionEngineService],
})
export class IdeaInventionEngineModule {}
