import { Controller, Get } from '@nestjs/common';
import { RegistryService } from './registry.service';

@Controller('registry')
export class RegistryController {
  constructor(
    private readonly registryService: RegistryService,
  ) {}

  @Get('summary')
  getSummary() {
    return this.registryService.getSummary();
  }
}
