import {
  Module,
} from '@nestjs/common';

import {
  CapabilityModule,
} from '../capabilities/capability.module';
import {
  PersistenceModule,
} from '../persistence';
import {
  MonitoringDiagnosticsController,
} from './controllers';
import {
  ComponentHealthCheckService,
  DiagnosticsService,
  MonitoringDiagnosticsService,
  MonitoringMetricsService,
  SystemMetricsService,
} from './services';

@Module({
  imports: [
    PersistenceModule,
    CapabilityModule,
  ],
  controllers: [
    MonitoringDiagnosticsController,
  ],
  providers: [
    ComponentHealthCheckService,
    SystemMetricsService,
    MonitoringDiagnosticsService,
    DiagnosticsService,
    MonitoringMetricsService,
  ],
  exports: [
    MonitoringDiagnosticsService,
    MonitoringMetricsService,
    DiagnosticsService,
  ],
})
export class MonitoringDiagnosticsModule {}