import {
  Controller,
  Get,
  Header,
} from '@nestjs/common';
import { Public } from '../../core-v1/auth/public.decorator';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Public()
  @Get()
  @Header('content-type', 'text/plain; version=0.0.4')
  render() {
    return this.metrics.render();
  }
}