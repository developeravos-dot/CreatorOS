import {
  Controller,
  Get,
} from '@nestjs/common';
import {
  QueueInfrastructureHealth,
  QueueHealthService,
} from '../services';
import {
  QueueSnapshot,
} from '../models';

@Controller('enterprise/queue-infrastructure')
export class QueueHealthController {
  constructor(
    private readonly healthService:
      QueueHealthService,
  ) {}

  @Get('health')
  getHealth():
    Promise<QueueInfrastructureHealth> {
    return this.healthService.getHealth();
  }

  @Get('snapshot')
  getSnapshot(): Promise<QueueSnapshot> {
    return this.healthService.getSnapshot();
  }
}
