import { randomUUID } from 'node:crypto';

import type {
  CapabilitySdkIdGenerator,
} from '../../contracts';

export class SdkIdGenerator
  implements CapabilitySdkIdGenerator
{
  generate(): string {
    return randomUUID();
  }
}