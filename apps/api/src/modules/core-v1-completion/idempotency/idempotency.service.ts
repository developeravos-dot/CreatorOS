import { PrismaService } from '../../persistence/prisma.service';
import { Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';
@Injectable()
export class IdempotencyService {
  constructor(private readonly persistence: PrismaService) {}

  hashBody(value: unknown): string {
    return createHash('sha256')
      .update(JSON.stringify(value ?? null))
      .digest('hex');
  }

  find(key: string) {
    return this.persistence.creatorIdempotencyKey.findUnique({
      where: { key },
    });
  }

  save(input: {
    key: string;
    method: string;
    path: string;
    requestHash: string;
    statusCode: number;
    response: unknown;
  }) {
    return this.persistence.creatorIdempotencyKey.upsert({
      where: { key: input.key },
      update: {
        statusCode: input.statusCode,
        response: input.response as object,
      },
      create: {
        key: input.key,
        method: input.method,
        path: input.path,
        requestHash: input.requestHash,
        statusCode: input.statusCode,
        response: input.response as object,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  }
}