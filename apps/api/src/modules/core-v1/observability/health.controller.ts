import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Public()
  @Get('live')
  live() {
    return {
      status: 'ok',
      check: 'liveness',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('ready')
  ready() {
    return {
      status: 'ok',
      check: 'readiness',
      timestamp: new Date().toISOString(),
    };
  }
}