import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { randomUUID } from 'node:crypto';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<{
      headers: Record<string, string | string[] | undefined>;
      requestId?: string;
    }>();
    const response = http.getResponse<{
      setHeader(name: string, value: string): void;
    }>();

    const current = request.headers['x-request-id'];
    const requestId =
      typeof current === 'string' && current.length > 0
        ? current
        : randomUUID();

    request.requestId = requestId;
    response.setHeader('x-request-id', requestId);

    return next.handle();
  }
}