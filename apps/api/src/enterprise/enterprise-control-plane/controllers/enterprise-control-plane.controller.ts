import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import {
  EnterpriseControlPlaneService,
} from '../services';

@Controller(
  'enterprise/control-plane',
)
export class EnterpriseControlPlaneController {
  constructor(
    private readonly controlPlane:
      EnterpriseControlPlaneService,
  ) {}

  @Get('status')
  status() {
    return this.controlPlane.snapshot();
  }

  @Get('commands')
  commands() {
    return this.controlPlane.listCommands();
  }

  @Post('components')
  register(
    @Body()
    body: {
      readonly componentId: string;
      readonly displayName: string;
      readonly capacity: number;
    },
  ) {
    return this.controlPlane.register(
      body,
    );
  }

  @Post('commands')
  command(
    @Body()
    body: {
      readonly commandId: string;
      readonly type:
        | 'enable-maintenance'
        | 'disable-maintenance'
        | 'drain'
        | 'resume'
        | 'rebalance';
      readonly componentId: string;
      readonly requestedBy: string;
    },
  ) {
    return this.controlPlane.command(
      body,
    );
  }
}
