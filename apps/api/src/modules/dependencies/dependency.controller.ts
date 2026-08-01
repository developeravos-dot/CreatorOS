import {
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { DependencyService } from './dependency.service';

@Controller('dependencies')
export class DependencyController {
  constructor(
    private readonly dependencyService: DependencyService,
  ) {}

  @Get()
  getAll() {
    return this.dependencyService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    const dependency = this.dependencyService.getById(id);

    if (!dependency) {
      throw new NotFoundException(
        `Dependency ${id} was not found`,
      );
    }

    return dependency;
  }
}
