import {
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CapabilityService } from './capability.service';

@Controller('capabilities')
export class CapabilityController {
  constructor(
    private readonly capabilityService: CapabilityService,
  ) {}

  @Get()
  getAll() {
    return this.capabilityService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    const capability = this.capabilityService.getById(id);

    if (!capability) {
      throw new NotFoundException(
        `Capability ${id} was not found`,
      );
    }

    return capability;
  }
}
