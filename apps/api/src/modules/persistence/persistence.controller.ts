import { Controller, Get } from '@nestjs/common';
import { PersistenceService } from './persistence.service';

@Controller('creatoros/platform/persistence')
export class PersistenceController {
  constructor(
    private readonly persistence:
      PersistenceService,
  ) {}

  @Get('health')
  getHealth() {
    return this.persistence.getHealth();
  }
}
