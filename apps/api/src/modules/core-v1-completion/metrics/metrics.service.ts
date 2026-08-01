import { Injectable } from '@nestjs/common';
import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  Registry,
} from 'prom-client';

@Injectable()
export class MetricsService {
  readonly registry = new Registry();

  readonly requests = new Counter({
    name: 'creatoros_http_requests_total',
    help: 'Total CreatorOS HTTP requests',
    labelNames: ['method', 'path', 'status'],
    registers: [this.registry],
  });

  readonly duration = new Histogram({
    name: 'creatoros_http_request_duration_seconds',
    help: 'CreatorOS HTTP request duration',
    labelNames: ['method', 'path', 'status'],
    registers: [this.registry],
  });

  constructor() {
    collectDefaultMetrics({
      register: this.registry,
      prefix: 'creatoros_',
    });
  }

  render(): Promise<string> {
    return this.registry.metrics();
  }
}