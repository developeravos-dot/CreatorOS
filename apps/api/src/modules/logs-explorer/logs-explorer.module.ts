import {
  Module,
} from '@nestjs/common';

import {
  LogsExplorerController,
} from './controllers';
import {
  LogsExplorerEngineService,
  LogsExplorerExportService,
  LogsExplorerQueryService,
} from './services';

@Module({
  controllers: [
    LogsExplorerController,
  ],
  providers: [
    LogsExplorerEngineService,
    LogsExplorerQueryService,
    LogsExplorerExportService,
  ],
  exports: [
    LogsExplorerEngineService,
    LogsExplorerQueryService,
    LogsExplorerExportService,
  ],
})
export class LogsExplorerModule {}