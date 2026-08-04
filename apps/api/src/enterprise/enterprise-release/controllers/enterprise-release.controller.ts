import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import {
  EnterpriseReleaseManagerService,
} from '../services';

@Controller(
  'enterprise/releases',
)
export class EnterpriseReleaseController {
  constructor(
    private readonly releases:
      EnterpriseReleaseManagerService,
  ) {}

  @Get()
  list() {
    return this.releases.list();
  }

  @Post()
  create(
    @Body()
    body: {
      readonly releaseId: string;
      readonly version: string;
      readonly environment:
        | 'staging'
        | 'production';
      readonly image: string;
      readonly replicas: number;
    },
  ) {
    const release =
      this.releases.create(body);

    return {
      release,
      validation:
        this.releases.validate(
          release,
        ),
    };
  }
}
