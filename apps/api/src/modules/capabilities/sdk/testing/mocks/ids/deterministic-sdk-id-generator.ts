import type {
  CapabilitySdkIdGenerator,
} from '../../../contracts';

export class DeterministicSdkIdGenerator
  implements CapabilitySdkIdGenerator
{
  private sequence: number;

  constructor(
    private readonly prefix = 'sdk-test',
    initialSequence = 0,
  ) {
    this.sequence = initialSequence;
  }

  generate(): string {
    this.sequence += 1;

    return [
      this.prefix,
      String(this.sequence).padStart(
        4,
        '0',
      ),
    ].join('-');
  }

  current(): number {
    return this.sequence;
  }

  reset(sequence = 0): void {
    this.sequence = sequence;
  }
}